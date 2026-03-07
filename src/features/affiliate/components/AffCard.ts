export interface AffCardProps {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
    ctaUrl: string;
    icon: string;
    badge?: string;
}

export function createAffCard(props: AffCardProps): string {
    const badgeHtml = props.badge ? `<div class="aff-badge" style="position: absolute; top: -10px; right: 10px; background: #ff4444; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;">${props.badge}</div>` : '';

    return `
        <a href="${props.ctaUrl}" target="_blank" rel="noopener noreferrer" class="aff-card" style="display: flex; flex-direction: column; padding: 16px; background: var(--bg-surface, #1a1a1a); border: 1px solid var(--border-color, #333); border-radius: 8px; text-decoration: none; color: inherit; position: relative; transition: transform 0.2s, border-color 0.2s;">
            ${badgeHtml}
            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <span style="font-size: 1.5rem; margin-right: 12px;">${props.icon}</span>
                <div>
                    <h4 style="margin: 0; font-size: 1rem; color: var(--text-base, #fff);">${props.title}</h4>
                    <span style="font-size: 0.8rem; color: var(--text-muted, #aaa);">${props.subtitle}</span>
                </div>
            </div>
            <p style="margin: 8px 0; font-size: 0.9rem; color: var(--text-secondary, #ccc); flex-grow: 1;">${props.description}</p>
            <div style="margin-top: 12px; padding: 8px 0; text-align: center; background: var(--accent-alpha, rgba(68, 136, 255, 0.1)); color: var(--accent-color, #4488ff); border-radius: 4px; font-weight: 500; font-size: 0.9rem;">
                ${props.ctaText}
            </div>
        </a>
    `;
}
