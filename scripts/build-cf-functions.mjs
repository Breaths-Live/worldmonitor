import fs from 'fs';
import path from 'path';

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        // Skip test files
        if (entry.name.endsWith('.test.mjs') || entry.name.endsWith('.test.ts') || entry.name.endsWith('.test.js')) continue;

        const srcPath = path.join(src, entry.name);
        let newName = entry.name;

        // Cloudflare Pages ignores files starting with `_`, so we strip the prefix for routes
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

            // If it's a route (not inside the data dir helpers)
            if (src !== 'api/data') {
                // Remove the edge runtime config
                content = content.replace(/export const config\s*=\s*\{[^\}]+\};\n*/g, '');

                // Rewrite Vercel handler signatures to Cloudflare Page Functions
                const oldAsync = /export default async function(\s+[a-zA-Z0-9_]+)?\s*\(\s*([a-zA-Z0-9_]+)[^)]*\)\s*\{/g;
                const oldSync = /export default function(\s+[a-zA-Z0-9_]+)?\s*\(\s*([a-zA-Z0-9_]+)[^)]*\)\s*\{/g;

                content = content.replace(oldAsync, 'export async function onRequest(context) {\n  const $2 = context.request;\n  Object.assign(globalThis.process.env, context.env);\n');
                content = content.replace(oldSync, 'export function onRequest(context) {\n  const $2 = context.request;\n  Object.assign(globalThis.process.env, context.env);\n');
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
console.log('[Cloudflare Builder] Successfully mapped api/ to functions/api/ for Cloudflare Pages compatible routing.');
