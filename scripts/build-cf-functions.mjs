import fs from 'fs';
import path from 'path';

/**
 * Cloudflare Pages Functions Adapter
 * Converts Vercel API handlers in /api/ to Cloudflare Pages Functions in /functions/api/
 *
 * Handles three Vercel handler patterns:
 * 1. Edge handlers:   export default async function handler(req) { ... }   → uses Web API Response
 * 2. Zero-arg:        export default async function handler() { ... }      → needs context injection
 * 3. Node.js style:   export default function handler(req, res) { ... }    → skipped (handled in post-process)
 *
 * Also:
 * - Strips leading `_` from filenames (Cloudflare ignores _ prefixed files)
 * - Skips .ts files that import from server/ (can't compile on Cloudflare)
 * - Rewrites internal imports to match renamed files
 */

// Files that use Node.js (req, res) pattern — these are post-processed separately
const NODE_RES_FILES = new Set(['story.js', 'og-story.js']);

// TS files to skip entirely (they import from server/ and need Vercel's bundler)
const SKIP_TS_FILES = new Set(['[rpc].ts']);

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        // Skip test files
        if (entry.name.endsWith('.test.mjs') || entry.name.endsWith('.test.ts') || entry.name.endsWith('.test.js')) continue;

        // Skip complex TS files that can't run on Cloudflare
        if (SKIP_TS_FILES.has(entry.name)) {
            console.log(`[Cloudflare Builder] Skipped ${path.join(src, entry.name)} (needs Vercel bundler)`);
            continue;
        }

        const srcPath = path.join(src, entry.name);
        let newName = entry.name;

        // Cloudflare Pages ignores files starting with `_`, so we strip the prefix
        if (newName.startsWith('_') && src === 'api') {
            newName = newName.substring(1);
        }

        // Convert Vercel catch-all [[...path]] semantics to Cloudflare [[path]]
        newName = newName.replace(/\[\[\.\.\.([^\]]+)\]\]/g, '[[$1]]');
        const destPath = path.join(dest, newName);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.ts'))) {
            // Skip Node.js-pattern files here; they're post-processed below
            if (NODE_RES_FILES.has(entry.name)) {
                // Just copy raw for now — post-process handles the full rewrite
                fs.copyFileSync(srcPath, destPath);
                continue;
            }

            let content = fs.readFileSync(srcPath, 'utf8');

            // Fix internal module imports pointing to renamed _ files (preserve ../ vs ./ prefix)
            content = content.replace(/from\s+['"](\.\/|\.\.\/|\.\.\/\.\.\/?)_([^'"]+)['"]/g, "from '$1$2'");

            // Process route handlers (not data helpers)
            if (src !== 'api/data') {
                // Remove the edge runtime config
                content = content.replace(/export const config\s*=\s*\{[^\}]+\};\n*/g, '');

                // Detect handler pattern
                const hasZeroArgs = /export default (?:async )?function\s+\w*\s*\(\s*\)/.test(content);
                const hasEdgeReq = /export default (?:async )?function\s+\w*\s*\(\s*\w+\s*\)/.test(content);

                if (hasZeroArgs) {
                    // Pattern 2: Zero-arg handler() → wrap with onRequest
                    content = content.replace(
                        /export default (async )?function\s+(\w*)\s*\(\s*\)\s*\{/,
                        'export $1function onRequest(context) {\n  Object.assign(globalThis.process.env, context.env);'
                    );
                } else if (hasEdgeReq) {
                    // Pattern 1: Edge handler(req) → normal conversion
                    content = content.replace(
                        /export default (async )?function\s+(\w*)\s*\(\s*(\w+)[^)]*\)\s*\{/,
                        'export $1function onRequest(context) {\n  const $3 = context.request;\n  Object.assign(globalThis.process.env, context.env);'
                    );
                }
            }

            // Global polyfill for top-level code (like process.env.NODE_ENV)
            const polyfill = `if (typeof globalThis.process === 'undefined') globalThis.process = {};\nif (typeof globalThis.process.env === 'undefined') globalThis.process.env = {};\n\n`;
            content = polyfill + content;

            fs.writeFileSync(destPath, content);
        } else if (entry.isFile()) {
            // Copy other assets (like .json)
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// ── Main ──

console.log('[Cloudflare Builder] Creating functions/ directory from api/ ...');
fs.rmSync('functions', { recursive: true, force: true });
copyDir('api', 'functions/api');

// ── Post-process: Node.js res-pattern files (story.js, og-story.js) ──

const NODE_RES_SHIM = `
class _CfRes {
  constructor() { this._status = 200; this._headers = {}; this._body = ''; }
  writeHead(s, h) { this._status = s; if (h) Object.assign(this._headers, h); return this; }
  setHeader(k, v) { this._headers[k] = v; return this; }
  status(s) { this._status = s; return this; }
  send(b) { this._body = b; return this; }
  end(b) { if (b) this._body = b; return this; }
  toResponse() {
    return new Response(this._body, { status: this._status, headers: this._headers });
  }
}
`;

for (const file of NODE_RES_FILES) {
    const filePath = path.join('functions', 'api', file);
    if (!fs.existsSync(filePath)) continue;

    // Re-read the original source
    let content = fs.readFileSync(path.join('api', file), 'utf8');

    // Remove edge config
    content = content.replace(/export const config\s*=\s*\{[^\}]+\};\n*/g, '');

    // Fix imports (strip _ prefix)
    content = content.replace(/from\s+['"](\.\/|\.\.\/|\.\.\/\.\.\/?)_([^'"]+)['"]/g, "from '$1$2'");

    // Detect the handler signature
    const match = content.match(/export default (async )?function\s+(\w*)\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*\{/);
    if (!match) { console.log(`[Cloudflare Builder] Warning: no Node.js handler found in ${file}`); continue; }

    const isAsync = match[1] || '';
    const reqName = match[3];
    const resName = match[4];

    // Replace the handler definition — use Proxy wrapper for headers (Cloudflare Headers are immutable)
    content = content.replace(
        /export default (async )?function\s+(\w*)\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*\{/,
        `export ${isAsync}function onRequest(context) {\n  Object.assign(globalThis.process.env, context.env);\n  const _cfReq = context.request;\n  const _hdrs = _cfReq.headers;\n  const ${reqName} = {\n    url: _cfReq.url,\n    method: _cfReq.method,\n    headers: new Proxy({}, { get: (_, k) => _hdrs.get(String(k)) || (k === 'host' ? new URL(_cfReq.url).host : undefined) }),\n  };\n  const ${resName} = new _CfRes();`
    );

    // Find the handler's closing brace and insert `return res.toResponse()` before it
    const handlerStart = content.indexOf('export');
    let braceCount = 0, inHandler = false, handlerEnd = -1;
    for (let i = handlerStart; i < content.length; i++) {
        if (content[i] === '{') { braceCount++; inHandler = true; }
        if (content[i] === '}') { braceCount--; }
        if (inHandler && braceCount === 0) { handlerEnd = i; break; }
    }

    if (handlerEnd > 0) {
        content = content.substring(0, handlerEnd) +
            `\n  return ${resName}.toResponse();\n` +
            content.substring(handlerEnd);
    }

    // Add polyfill and shim at the top
    const polyfill = `if (typeof globalThis.process === 'undefined') globalThis.process = {};\nif (typeof globalThis.process.env === 'undefined') globalThis.process.env = {};\n\n`;
    content = polyfill + NODE_RES_SHIM + '\n' + content;

    fs.writeFileSync(filePath, content);
    console.log(`[Cloudflare Builder] Shimmed Node.js handler: ${file}`);
}

// ── Post-process: rename rpc-proxy.js to [[rpc]].js for catch-all routing ──
const proxyDir = path.join('functions', 'api', '[domain]', 'v1');
const proxySrc = path.join(proxyDir, 'rpc-proxy.js');
const proxyDest = path.join(proxyDir, '[[rpc]].js');
if (fs.existsSync(proxySrc)) {
    // Read, transform (same as Edge handler), and write to catch-all filename
    let content = fs.readFileSync(proxySrc, 'utf8');
    content = content.replace(/from\s+['"](\.\/|\.\.\/|\.\.\/\.\.\/?)_([^'"]+)['"]/g, "from '$1$2'");
    content = content.replace(/export const config\s*=\s*\{[^\}]+\};\n*/g, '');
    content = content.replace(
        /export default (async )?function\s+(\w*)\s*\(\s*(\w+)[^)]*\)\s*\{/,
        'export $1function onRequest(context) {\n  const $3 = context.request;\n  Object.assign(globalThis.process.env, context.env);'
    );
    const polyfill = `if (typeof globalThis.process === 'undefined') globalThis.process = {};\nif (typeof globalThis.process.env === 'undefined') globalThis.process.env = {};\n\n`;
    content = polyfill + content;
    fs.writeFileSync(proxyDest, content);
    fs.unlinkSync(proxySrc);
    console.log(`[Cloudflare Builder] Created RPC proxy: ${proxyDest}`);
}

console.log('[Cloudflare Builder] Successfully mapped api/ to functions/api/ for Cloudflare Pages compatible routing.');
