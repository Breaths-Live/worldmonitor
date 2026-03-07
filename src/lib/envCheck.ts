/**
 * Environment Variables Validation
 * Logs warnings at startup if API keys are missing.
 * Never crashes the app — just warns in console.
 */

interface EnvKeyInfo {
    key: string;
    label: string;
    required: boolean;
}

const ENV_KEYS: EnvKeyInfo[] = [
    { key: 'VITE_GROQ_API_KEY', label: 'Groq (AI Insights)', required: false },
    { key: 'VITE_FINNHUB_API_KEY', label: 'Finnhub (Markets)', required: false },
    { key: 'VITE_FRED_API_KEY', label: 'FRED (Economic)', required: false },
    { key: 'VITE_ALPHA_VANTAGE_KEY', label: 'Alpha Vantage (Heatmap)', required: false },
    { key: 'VITE_NASA_FIRMS_API_KEY', label: 'NASA FIRMS (Fires)', required: false },
    { key: 'VITE_AISSTREAM_API_KEY', label: 'AISStream (Ships)', required: false },
    { key: 'VITE_OPENSKY_CLIENT_ID', label: 'OpenSky (Flights)', required: false },
    { key: 'VITE_OPENSKY_CLIENT_SECRET', label: 'OpenSky Secret', required: false },
];

export interface EnvCheckResult {
    missing: EnvKeyInfo[];
    present: EnvKeyInfo[];
    allPresent: boolean;
}

export function checkEnvironmentVariables(): EnvCheckResult {
    const missing: EnvKeyInfo[] = [];
    const present: EnvKeyInfo[] = [];

    for (const info of ENV_KEYS) {
        const value = (import.meta as unknown as Record<string, Record<string, string>>)['env']?.[info.key];
        if (!value || value.trim() === '' || value === 'undefined') {
            missing.push(info);
        } else {
            present.push(info);
        }
    }

    if (missing.length > 0) {
        console.warn(
            `[EnvCheck] ⚠️ ${missing.length} API key(s) missing:\n` +
            missing.map(k => `  • ${k.label} (${k.key})`).join('\n') +
            '\n  App will continue — affected panels may show "API key missing".'
        );
    } else {
        console.info('[EnvCheck] ✅ All API keys present.');
    }

    return { missing, present, allPresent: missing.length === 0 };
}

/**
 * Returns HTML string for a fallback panel when an API key is missing.
 */
export function renderMissingKeyNotice(label: string): string {
    return `
    <div style="padding: 24px; text-align: center; color: var(--text-muted, #888);">
      <div style="font-size: 2rem; margin-bottom: 8px;">🔑</div>
      <div style="font-size: 0.9rem; font-weight: 600;">API Key Missing</div>
      <div style="font-size: 0.8rem; margin-top: 4px; opacity: 0.7;">${label}</div>
      <div style="font-size: 0.75rem; margin-top: 8px; opacity: 0.5;">Add the key in .env.local to enable this panel</div>
    </div>
  `;
}
