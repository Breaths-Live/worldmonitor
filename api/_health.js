export const config = { runtime: 'edge' };

const KEYS = [
  'GROQ_API_KEY',
  'OPENROUTER_API_KEY',
  'FINNHUB_API_KEY',
  'FRED_API_KEY',
  'EIA_API_KEY',
  'ACLED_ACCESS_TOKEN',
  'ACLED_EMAIL',
  'WORLDMONITOR_API_KEY',
];

export default async function handler() {
  const keys = {};
  for (const k of KEYS) keys[k] = Boolean(process.env[k] && process.env[k].length > 0);

  const payload = {
    ok: true,
    timestamp: Date.now(),
    keys,
    nodeEnv: process.env.NODE_ENV || 'development',
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    },
  });
}
