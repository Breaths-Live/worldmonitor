import { getCorsHeaders, isDisallowedOrigin } from './_cors.js';

export const config = { runtime: 'edge' };

// CISA and The Hacker News RSS feeds
const FEEDS = [
    { url: 'https://www.cisa.gov/cybersecurity-advisories/all.xml', source: 'CISA' },
    { url: 'https://feeds.feedburner.com/TheHackersNews', source: 'The Hacker News' }
];

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, { ...options, signal: controller.signal });
    } finally {
        clearTimeout(timeout);
    }
}

function parseRss(xmlText, sourceName) {
    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null) {
        const itemContent = match[1];

        // Extract title
        const titleMatch = itemContent.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
            itemContent.match(/<title>([\s\S]*?)<\/title>/);
        const title = titleMatch ? titleMatch[1].trim() : '';

        // Extract link
        const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);
        const link = linkMatch ? linkMatch[1].trim() : '';

        // Extract description
        let descMatch = itemContent.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
            itemContent.match(/<description>([\s\S]*?)<\/description>/);
        let desc = descMatch ? descMatch[1].trim() : '';

        // Strip HTML from description and truncate
        desc = desc.replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/\n+/g, ' ')
            .trim();
        if (desc.length > 200) desc = desc.substring(0, 197) + '...';

        // Extract pubDate
        const dateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
        let pubDate = dateMatch ? dateMatch[1].trim() : new Date().toISOString();

        if (title && link) {
            // Create a deterministic ID
            const id = 'cyb_' + btoa(link).substring(0, 16);

            let ts = new Date().getTime();
            try {
                ts = new Date(pubDate).getTime();
            } catch (e) { }

            items.push({
                id,
                source: sourceName,
                title,
                link,
                desc,
                pubDate: new Date(ts).toISOString(),
                ts
            });
        }
    }

    return items;
}

export default async function handler(req) {
    const corsHeaders = getCorsHeaders(req, 'GET, OPTIONS');

    if (isDisallowedOrigin(req)) {
        return new Response(JSON.stringify({ error: 'Origin not allowed' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }

    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
        const responses = await Promise.allSettled(
            FEEDS.map(feed =>
                fetchWithTimeout(feed.url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (compatible; WorldMonitorBot/1.0)',
                        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
                    }
                }).then(r => r.text()).then(xml => parseRss(xml, feed.source))
            )
        );

        let allAlerts = [];
        for (const res of responses) {
            if (res.status === 'fulfilled' && res.value) {
                allAlerts.push(...res.value);
            }
        }

        // Sort by timestamp descending
        allAlerts.sort((a, b) => b.ts - a.ts);

        // Limit to latest 30
        allAlerts = allAlerts.slice(0, 30);

        // Clean up internal properties
        allAlerts = allAlerts.map(({ ts, ...alert }) => alert);

        return new Response(JSON.stringify({
            configured: true,
            alerts: allAlerts,
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=120',
                ...corsHeaders
            },
        });

    } catch (error) {
        return new Response(JSON.stringify({
            configured: true,
            alerts: [],
            error: 'Failed to fetch cyber threats',
            details: String(error)
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }
}
