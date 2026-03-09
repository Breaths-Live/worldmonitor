/**
 * Cloudflare Pages proxy for sebuf RPC endpoints.
 *
 * All /api/{domain}/v1/{rpc} requests are forwarded to the upstream
 * WorldMonitor server since the original TypeScript handlers require
 * a full bundler (Vercel) that Cloudflare Pages doesn't provide.
 *
 * Auth is handled by the upstream server — we only add CORS headers
 * and forward the Origin so the upstream can validate trusted origins.
 */

import { getCorsHeaders, isDisallowedOrigin } from '../../_cors.js';

export const config = { runtime: 'edge' };

const UPSTREAM = 'https://worldmonitor.app';

export default async function handler(req) {
    // Block disallowed origins
    if (isDisallowedOrigin(req))
        return new Response('Forbidden', { status: 403 });

    const cors = getCorsHeaders(req);
    if (req.method === 'OPTIONS')
        return new Response(null, { status: 204, headers: cors });

    // Forward the request to upstream, passing Origin so upstream can authenticate
    const url = new URL(req.url);
    const upstreamUrl = `${UPSTREAM}${url.pathname}${url.search}`;

    try {
        const fwdHeaders = {
            'User-Agent': 'WorldMonitor-Proxy/1.0',
            'Accept': 'application/json',
            // Forward browser's Origin so upstream trusts same-origin requests
            'Origin': 'https://worldmonitor.app',
        };

        const upstreamResp = await fetch(upstreamUrl, {
            method: req.method,
            headers: fwdHeaders,
            body: req.method === 'POST' ? req.body : undefined,
        });

        // Stream the response back with our CORS headers
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
