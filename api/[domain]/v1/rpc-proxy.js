/**
 * Cloudflare Pages proxy for sebuf RPC endpoints.
 *
 * All /api/{domain}/v1/{rpc} requests are forwarded to the upstream
 * WorldMonitor server since the original TypeScript handlers require
 * a full bundler (Vercel) that Cloudflare Pages doesn't provide.
 *
 * This replaces the complex api/[domain]/v1/[rpc].ts at build time.
 */

import { getCorsHeaders, isDisallowedOrigin } from '../../_cors.js';
import { validateApiKey } from '../../_api-key.js';

export const config = { runtime: 'edge' };

const UPSTREAM = 'https://worldmonitor.app';

export default async function handler(req) {
    // CORS / origin check
    if (isDisallowedOrigin(req))
        return new Response('Forbidden', { status: 403 });

    const cors = getCorsHeaders(req);
    if (req.method === 'OPTIONS')
        return new Response(null, { status: 204, headers: cors });

    const apiKeyResult = validateApiKey(req);
    if (apiKeyResult.required && !apiKeyResult.valid)
        return new Response(JSON.stringify({ error: apiKeyResult.error }), {
            status: 401, headers: { ...cors, 'Content-Type': 'application/json' },
        });

    // Forward the request to upstream
    const url = new URL(req.url);
    const upstreamUrl = `${UPSTREAM}${url.pathname}${url.search}`;

    try {
        const upstreamResp = await fetch(upstreamUrl, {
            method: req.method,
            headers: {
                'User-Agent': 'WorldMonitor-Proxy/1.0',
                'Accept': 'application/json',
            },
            // Forward body for POST requests
            body: req.method === 'POST' ? req.body : undefined,
        });

        // Stream the response back
        const respHeaders = {
            ...cors,
            'Content-Type': upstreamResp.headers.get('Content-Type') || 'application/json',
        };

        // Preserve cache headers from upstream
        const cc = upstreamResp.headers.get('Cache-Control');
        if (cc) respHeaders['Cache-Control'] = cc;

        return new Response(upstreamResp.body, {
            status: upstreamResp.status,
            headers: respHeaders,
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'upstream_unavailable', message: String(err) }), {
            status: 502,
            headers: { ...cors, 'Content-Type': 'application/json' },
        });
    }
}
