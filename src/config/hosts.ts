/**
 * Central configuration for Breaths v1 subdomains.
 * Standardizing on the .live domain.
 */
export const BREATHS_HOSTS = {
    marketing: 'breaths.live',
    app: 'app.breaths.live',
    world: 'world.breaths.live',
    tech: 'tech.breaths.live',
    health: 'health.breaths.live',
    sports: 'sports.breaths.live',
    weather: 'weather.breaths.live',
    travel: 'travel.breaths.live',
    finance: 'finance.breaths.live',
} as const;

/**
 * Detects the current section based on the window hostname.
 * Falls back to 'app' if the hostname is unknown.
 */
export function getCurrentSection(): keyof typeof BREATHS_HOSTS {
    if (typeof window === 'undefined') return 'app';

    const host = window.location.hostname;

    if (host === BREATHS_HOSTS.world) return 'world';
    if (host === BREATHS_HOSTS.tech) return 'tech';
    if (host === BREATHS_HOSTS.health) return 'health';
    if (host === BREATHS_HOSTS.sports) return 'sports';
    if (host === BREATHS_HOSTS.app) return 'app';

    return 'app';
}
