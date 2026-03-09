import { getApiBaseUrl } from '@/services/runtime';

export interface CyberThreatAlert {
    id: string;
    source: string;
    title: string;
    link: string;
    desc: string;
    pubDate: string;
}

export interface CyberThreatsResponse {
    configured: boolean;
    alerts: CyberThreatAlert[];
    timestamp: string;
    error?: string;
}

let cachedResponse: CyberThreatsResponse | null = null;
let lastFetchAt = 0;
const CACHE_TTL = 30_000;
let pollingInterval: ReturnType<typeof setInterval> | null = null;
let updateCallbacks: Array<(data: CyberThreatsResponse) => void> = [];

function getCyberThreatsApiUrl(): string {
    const base = getApiBaseUrl();
    return `${base}/api/cyber-threats`;
}

export async function fetchCyberThreats(): Promise<CyberThreatsResponse> {
    const now = Date.now();
    if (cachedResponse && now - lastFetchAt < CACHE_TTL) {
        return cachedResponse;
    }

    try {
        const res = await fetch(getCyberThreatsApiUrl(), {
            headers: { Accept: 'application/json' },
        });
        if (!res.ok) {
            return { configured: false, alerts: [], timestamp: new Date().toISOString(), error: `HTTP ${res.status}` };
        }
        const data: CyberThreatsResponse = await res.json();
        cachedResponse = data;
        lastFetchAt = now;

        for (const cb of updateCallbacks) cb(data);

        return data;
    } catch (err) {
        return { configured: false, alerts: [], timestamp: new Date().toISOString(), error: String(err) };
    }
}

export function onCyberThreatsUpdate(cb: (data: CyberThreatsResponse) => void): void {
    updateCallbacks.push(cb);
}

export function startCyberThreatsPolling(): void {
    if (pollingInterval) return;
    pollingInterval = setInterval(async () => {
        const data = await fetchCyberThreats();
        for (const cb of updateCallbacks) cb(data);
    }, 120_000);
}

export function stopCyberThreatsPolling(): void {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
    }
    updateCallbacks = [];
}
