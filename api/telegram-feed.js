// Telegram feed — scrapes public Telegram channels via t.me/s/ web preview
// Works on Cloudflare Workers/Pages without persistent connections.
// Users can customize channels via TELEGRAM_CHANNELS env var.

import { getCorsHeaders, isDisallowedOrigin } from './_cors.js';

export const config = { runtime: 'edge' };

// Default OSINT channels — user can override via TELEGRAM_CHANNELS env var
// Format: comma-separated channel usernames
const DEFAULT_CHANNELS = [
  // Geopolitics & Conflict
  { name: 'intelslava', title: 'Intel Slava Z', topic: 'conflict' },
  { name: 'ryaborig', title: 'Rybar', topic: 'conflict' },
  { name: 'medaborad', title: 'Middle East Spectator', topic: 'middleeast' },
  { name: 'bbaborad', title: 'BBA OSINT', topic: 'osint' },
  // Breaking news
  { name: 'BBCBreaking', title: 'BBC Breaking', topic: 'breaking' },
  { name: 'raborad', title: 'RA OSINT', topic: 'osint' },
  // Alerts & Intel
  { name: 'warmonitors', title: 'War Monitors', topic: 'alerts' },
  { name: 'TheIntelHub', title: 'The Intel Hub', topic: 'osint' },
];

// Topic keyword detection for auto-classification
const TOPIC_KEYWORDS = {
  breaking: /\b(BREAKING|URGENT|ALERT|JUST IN|FLASH)\b/i,
  conflict: /\b(military|troops|missile|strike|bomb|attack|war|army|navy|combat|battle|artillery|drone|weapon)\b/i,
  alerts: /\b(warning|siren|evacuation|emergency|threat|casualties|killed|explosion)\b/i,
  osint: /\b(OSINT|satellite|imagery|intercept|intel|reconnaissance|surveillance|source)\b/i,
  middleeast: /\b(Israel|Palestine|Gaza|Hamas|Hezbollah|Lebanon|Iran|Syria|Yemen|Houthi|IDF)\b/i,
  politics: /\b(election|president|parliament|summit|treaty|sanction|NATO|UN|EU|diplomat)\b/i,
};

function detectTopic(text) {
  for (const [topic, re] of Object.entries(TOPIC_KEYWORDS)) {
    if (re.test(text)) return topic;
  }
  return 'general';
}

function isEarlySignal(text) {
  return /\b(BREAKING|URGENT|ALERT|JUST IN|FLASH)\b/i.test(text);
}

// Parse HTML from t.me/s/channel_name to extract messages
function parseChannelHtml(html, channelName, channelTitle) {
  const messages = [];

  // Match each message block using data-post attribute
  const msgRegex = /data-post="([^"]+)"[\s\S]*?<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<\/div>|<div class="tgme_widget_message_footer)/g;
  let match;

  while ((match = msgRegex.exec(html)) !== null) {
    const postId = match[1]; // e.g. "intelslava/84245"
    let rawText = match[2];

    // Strip HTML tags but preserve line breaks
    rawText = rawText.replace(/<br\s*\/?>/gi, '\n');
    rawText = rawText.replace(/<[^>]+>/g, '');
    rawText = rawText.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    rawText = rawText.trim();

    if (!rawText || rawText.length < 5) continue;

    const msgNum = postId.split('/')[1];
    messages.push({
      id: `tg_${channelName}_${msgNum}`,
      postId,
      text: rawText,
      channel: channelName,
      channelTitle: channelTitle || channelName,
    });
  }

  // Extract timestamps separately
  const timeRegex = /data-post="([^"]+)"[\s\S]*?<time[^>]*datetime="([^"]+)"/g;
  const timestamps = {};
  let timeMatch;
  while ((timeMatch = timeRegex.exec(html)) !== null) {
    timestamps[timeMatch[1]] = timeMatch[2];
  }

  // Merge timestamps into messages
  for (const msg of messages) {
    msg.ts = timestamps[msg.postId] || new Date().toISOString();
  }

  return messages;
}

async function fetchChannel(channelInfo, limit) {
  const { name, title, topic } = channelInfo;
  try {
    const resp = await fetch(`https://t.me/s/${name}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
    });
    if (!resp.ok) return [];

    const html = await resp.text();
    const messages = parseChannelHtml(html, name, title);

    // Assign topic and earlySignal
    return messages.map(m => ({
      id: m.id,
      source: 'telegram',
      channel: m.channel,
      channelTitle: m.channelTitle,
      url: `https://t.me/${m.postId}`,
      ts: m.ts,
      text: m.text.substring(0, 2000), // Limit text length
      topic: topic || detectTopic(m.text),
      tags: [],
      earlySignal: isEarlySignal(m.text),
    })).slice(-limit); // Keep latest N per channel
  } catch {
    return [];
  }
}

function getChannels() {
  // Allow override via env var: "channel1:Title1:topic,channel2:Title2:topic"
  const envChannels = (typeof process !== 'undefined' && process.env?.TELEGRAM_CHANNELS) || '';
  if (envChannels) {
    return envChannels.split(',').map(c => {
      const [name, title, topic] = c.trim().split(':');
      return { name, title: title || name, topic: topic || 'general' };
    }).filter(c => c.name);
  }
  return DEFAULT_CHANNELS;
}

export default async function handler(req) {
  const cors = getCorsHeaders(req, 'GET, OPTIONS');

  if (req.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: cors });
  if (isDisallowedOrigin(req))
    return new Response(JSON.stringify({ error: 'Origin not allowed' }), { status: 403, headers: cors });

  const url = new URL(req.url);
  const limit = Math.max(1, Math.min(200, parseInt(url.searchParams.get('limit') || '50', 10) || 50));
  const topicFilter = (url.searchParams.get('topic') || '').toLowerCase();
  const channelFilter = (url.searchParams.get('channel') || '').toLowerCase();

  const channels = getChannels();
  const perChannel = Math.max(5, Math.ceil(limit / channels.length));

  // Fetch all channels in parallel
  const results = await Promise.allSettled(
    channels.map(ch => fetchChannel(ch, perChannel))
  );

  let allItems = [];
  for (const r of results) {
    if (r.status === 'fulfilled') allItems.push(...r.value);
  }

  // Sort by timestamp (newest first)
  allItems.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());

  // Apply filters
  if (topicFilter && topicFilter !== 'all') {
    allItems = allItems.filter(m => m.topic === topicFilter);
  }
  if (channelFilter) {
    allItems = allItems.filter(m => m.channel.toLowerCase() === channelFilter);
  }

  // Limit total results
  allItems = allItems.slice(0, limit);

  const response = {
    source: 'telegram',
    earlySignal: allItems.some(m => m.earlySignal),
    enabled: true,
    count: allItems.length,
    updatedAt: new Date().toISOString(),
    items: allItems,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=30',
      ...cors,
    },
  });
}
