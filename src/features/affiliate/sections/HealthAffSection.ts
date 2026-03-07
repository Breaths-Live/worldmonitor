import { createAdSenseSlot } from '../components/AdSenseSlot';
import { createAffCard } from '../components/AffCard';
import { createAffCardGrid } from '../components/AffCardGrid';
import { createBlogCard, createBlogCardGrid } from '../components/BlogCard';
import { createWidgetPlaceholder } from '../components/WidgetPlaceholder';
import { DEFAULT_AFFILIATE_CONFIG } from '../config/affiliateConfig';

export function renderHealthAffSection(): string {
    const safetyWingCard = createAffCard({
        title: 'SafetyWing',
        subtitle: 'Nomad Insure',
        description: 'Global travel medical insurance for nomads and remote workers.',
        ctaText: 'Get Plan →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.safetyWing,
        icon: '💊',
        badge: '10–20% comm'
    });

    const insubuyCard = createAffCard({
        title: 'Insubuy',
        subtitle: 'US Med Cover',
        description: 'Comprehensive visitors insurance for travel to the United States.',
        ctaText: 'Compare Plans →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.insubuy,
        icon: '🏥',
        badge: '$1.5–150 fix'
    });

    const airaloCard = createAffCard({
        title: 'Airalo',
        subtitle: 'eSIM emergency',
        description: 'Stay connected globally to access emergency health resources instantly.',
        ctaText: 'Stay Online →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.airaloHealth,
        icon: '📱',
        badge: '12% comm'
    });

    const blog1 = createBlogCard({
        title: 'Vaccine Requirements by Country 2026',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.blogVaccineReqs
    });

    const blog2 = createBlogCard({
        title: 'Best Travel Health Insurance',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.blogTravelHealthIns
    });

    const blog3 = createBlogCard({
        title: 'Emergency Apps Every Traveler Needs',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.blogEmergencyApps
    });

    return `
        <div class="aff-section aff-health" style="margin-top: 32px; border-top: 1px solid var(--border-color, #333); padding-top: 16px;">
            <h3 style="color: var(--text-base, #fff); font-size: 1.1rem; margin-bottom: 16px;">Health & Security Tools</h3>
            ${createAffCardGrid([safetyWingCard, insubuyCard, airaloCard], 3)}
            
            <h3 style="color: var(--text-base, #fff); font-size: 1.1rem; margin-top: 24px; margin-bottom: 16px;">Essential Health Guides</h3>
            ${createBlogCardGrid([blog1, blog2, blog3])}
            
            ${createWidgetPlaceholder('expedia-banner-728x90', '100%', 'Expedia Banner (728x90)')}
            ${createAdSenseSlot(DEFAULT_AFFILIATE_CONFIG.adsense.health, '728px', '90px', 'Sponsored')}
        </div>
    `;
}
