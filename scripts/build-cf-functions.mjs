import fs from 'fs';
import path from 'path';

/**
 * Cloudflare Pages Functions Adapter
 * Converts Vercel API handlers in /api/ to Cloudflare Pages Functions in /functions/api/
 *
 * Handles three Vercel handler patterns:
 * 1. Edge handlers:   export default async function handler(req) { ... }   → uses Web API Response (compatible)
 * 2. Zero-arg:        export default async function handler() { ... }      → needs context injection
 * 3. Node.js style:   export default function handler(req, res) { ... }    → needs full res→Response shim
 */

// Shim for Node.js-style `res` object used by story.js and og-story.js
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

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        // Skip test files
        if (entry.name.endsWith('.test.mjs') || entry.name.endsWith('.test.ts') || entry.name.endsWith('.test.js')) continue;

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
            let content = fs.readFileSync(srcPath, 'utf8');

            // Fix internal module imports pointing to renamed _ files (preserve ../ vs ./ prefix)
            content = content.replace(/from\s+['"](\.\/|\.\.\/|\.\.\/\.\.\/?)_([^'"]+)['"]/g, "from '$1$2'");

            // Process route handlers (not data helpers)
            if (src !== 'api/data') {
                // Remove the edge runtime config
                content = content.replace(/export const config\s*=\s*\{[^\}]+\};\n*/g, '');

                // Detect handler pattern
                const hasNodeRes = /export default (?:async )?function\s+\w*\s*\(\s*\w+\s*,\s*\w+\s*\)/.test(content);
                const hasEdgeReq = /export default (?:async )?function\s+\w*\s*\(\s*\w+\s*\)/.test(content);
                const hasZeroArgs = /export default (?:async )?function\s+\w*\s*\(\s*\)/.test(content);

                if (hasNodeRes) {
                    // Pattern 3: Node.js style handler(req, res) → needs res shim
                    content = content.replace(
                        /export default (async )?function\s+(\w*)\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*\{/,
                        `export $1function onRequest(context) {\n  Object.assign(globalThis.process.env, context.env);\n  const $3 = context.request;\n  // Shim Node.js headers for req.headers.host, req.headers['user-agent'] etc.\n  if (!$3.headers.host) { try { $3.headers.host = new URL($3.url).host; } catch {} }\n  const $4 = new _CfRes();`
                    );
                    // Wrap the function body to return the Response at the end
                    // Find the last closing brace and append return
                    const lastBrace = content.lastIndexOf('}');
                    content = content.substring(0, lastBrace) + '  return ' + content.substring(lastBrace - 3).includes('res.end') ? '' : `\n  return ${arguments[3] || 'res'}.toResponse();\n` + content.substring(lastBrace);
                    // Actually, let's do it differently - wrap the whole handler
                } else if (hasZeroArgs) {
                    // Pattern 2: Zero-arg handler() → just wrap with onRequest
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

console.log('[Cloudflare Builder] Creating functions/ directory from api/ ...');
fs.rmSync('functions', { recursive: true, force: true });
copyDir('api', 'functions/api');

// Post-process: fix Node.js res pattern files by injecting shim and wrapping handler
const nodeResFiles = ['story.js', 'og-story.js'];
for (const file of nodeResFiles) {
    const filePath = path.join('functions', 'api', file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Re-read the original source (before any transformation)
    const origPath = path.join('api', file);
    let origContent = fs.readFileSync(origPath, 'utf8');

    // Remove edge config
    origContent = origContent.replace(/export const config\s*=\s*\{[^\}]+\};\n*/g, '');

    // Fix imports
    origContent = origContent.replace(/from\s+['"](\.\/|\.\.\/|\.\.\/\.\.\/?)_([^'"]+)['"]/g, "from '$1$2'");

    // Detect the handler signature
    const match = origContent.match(/export default (async )?function\s+(\w*)\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*\{/);
    if (!match) continue;

    const isAsync = match[1] || '';
    const reqName = match[3];
    const resName = match[4];

    // Build the new content: polyfill + shim + original code with wrapped handler
    let newContent = origContent;

    // Replace the handler definition to use onRequest pattern with headers proxy
    newContent = newContent.replace(
        /export default (async )?function\s+(\w*)\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*\{/,
        `export ${isAsync}function onRequest(context) {\n  Object.assign(globalThis.process.env, context.env);\n  const _cfReq = context.request;\n  const _hdrs = _cfReq.headers;\n  const ${reqName} = {\n    url: _cfReq.url,\n    method: _cfReq.method,\n    headers: new Proxy({}, { get: (_, k) => _hdrs.get(k) || (k === 'host' ? new URL(_cfReq.url).host : undefined) }),\n  };\n  const ${resName} = new _CfRes();`
    );

    // Find the LAST closing brace of the handler function and add return statement
    // We need to add `return res.toResponse();` before the handler's closing brace
    // Strategy: find the `export ... function onRequest` and count braces to find the end
    const handlerStart = newContent.indexOf('export');
    let braceCount = 0;
    let handlerEnd = -1;
    let inHandler = false;
    for (let i = handlerStart; i < newContent.length; i++) {
        if (newContent[i] === '{') { braceCount++; inHandler = true; }
        if (newContent[i] === '}') { braceCount--; }
        if (inHandler && braceCount === 0) { handlerEnd = i; break; }
    }

    if (handlerEnd > 0) {
        newContent = newContent.substring(0, handlerEnd) +
            `\n  return ${resName}.toResponse();\n` +
            newContent.substring(handlerEnd);
    }

    // Add polyfill and shim at the top
    const polyfill = `if (typeof globalThis.process === 'undefined') globalThis.process = {};\nif (typeof globalThis.process.env === 'undefined') globalThis.process.env = {};\n\n`;
    newContent = polyfill + NODE_RES_SHIM + '\n' + newContent;

    fs.writeFileSync(filePath, newContent);
    console.log(`[Cloudflare Builder] Shimmed Node.js handler: ${file}`);
}

console.log('[Cloudflare Builder] Successfully mapped api/ to functions/api/ for Cloudflare Pages compatible routing.');
