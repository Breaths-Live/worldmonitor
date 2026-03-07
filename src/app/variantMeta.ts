/**
 * Dynamic Meta Tags per Variant
 * Automatically updates <title> and <meta description> based on SITE_VARIANT.
 * Called once on app init.
 */

interface VariantMeta {
    title: string;
    description: string;
}

const VARIANT_META: Record<string, VariantMeta> = {
    full: {
        title: 'World Monitor — Global Situation with AI Insights',
        description: 'AI-powered real-time global intelligence dashboard with live news, markets, military tracking, infrastructure monitoring, and geopolitical data.',
    },
    tech: {
        title: 'Tech Monitor — Cyber Threats, AI News & Cloud Status',
        description: 'Real-time tech intelligence: cybersecurity threats, AI breakthroughs, cloud infrastructure status, and startup ecosystem tracking.',
    },
    finance: {
        title: 'Finance Monitor — Markets, Commodities & Trade Policy',
        description: 'Live market data, commodity prices, crypto tracking, economic indicators, and global trade policy analysis.',
    },
    travel: {
        title: 'Travel Monitor — Real-time Travel Alerts & Deals',
        description: 'Live travel warnings, flight tracking, hotel deals, destination safety scores, and real-time travel intelligence.',
    },
    climate: {
        title: 'Weather & Climate Monitor — Extreme Weather Alerts',
        description: 'Real-time extreme weather alerts, climate anomalies, natural disaster tracking, and travel weather intelligence.',
    },
    health: {
        title: 'Health Risk Monitor — Global Outbreak Alerts',
        description: 'Live disease outbreak tracking, vaccination requirements, health advisories, and global health risk scores.',
    },
    sports: {
        title: 'Sports & Events — Live Scores & Event Travel',
        description: 'Live sports scores, event schedules, stadium information, and sports travel packages worldwide.',
    },
    happy: {
        title: 'Good News Monitor — Positive Stories & Progress',
        description: 'Curated positive news, scientific breakthroughs, species comebacks, renewable energy progress, and inspiring human stories.',
    },
};

export function applyVariantMeta(variant: string): void {
    const meta = VARIANT_META[variant] ?? VARIANT_META['full']!;

    // Update <title>
    document.title = meta.title;

    // Update <meta name="title">
    const metaTitle = document.querySelector('meta[name="title"]');
    if (metaTitle) metaTitle.setAttribute('content', meta.title);

    // Update <meta name="description">
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', meta.description);

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    // Update Twitter tags
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', meta.title);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', meta.description);
}
