import { createAdSenseSlot } from '../components/AdSenseSlot';
import { createAffCard } from '../components/AffCard';
import { createAffCardGrid } from '../components/AffCardGrid';
import { DEFAULT_AFFILIATE_CONFIG } from '../config/affiliateConfig';

export function renderTechAffSection(): string {
    const nordVpnCard = createAffCard({
        title: 'NordVPN',
        subtitle: 'Protect your data',
        description: 'Military-grade encryption for secure browsing and threat protection anywhere.',
        ctaText: 'Get VPN →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.nordVpn,
        icon: '🔒',
        badge: '40–100% comm 🔥'
    });

    const hostingerCard = createAffCard({
        title: 'Hostinger',
        subtitle: 'Deploy your app',
        description: 'Fast, secure, and reliable web hosting for your tech projects and SaaS apps.',
        ctaText: 'Start Hosting →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.hostinger,
        icon: '☁️',
        badge: 'SaaS hosting'
    });

    return `
        <div class="aff-section aff-tech" style="margin-top: 32px; border-top: 1px solid var(--border-color, #333); padding-top: 16px;">
            <h3 style="color: var(--text-base, #fff); font-size: 1.1rem; margin-bottom: 16px;">Essential Security & Infrastructure</h3>
            ${createAffCardGrid([nordVpnCard, hostingerCard], 2)}
            ${createAdSenseSlot(DEFAULT_AFFILIATE_CONFIG.adsense.tech, '728px', '90px', 'Sponsored')}
        </div>
    `;
}
