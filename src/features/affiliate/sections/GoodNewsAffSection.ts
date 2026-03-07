import { createAdSenseSlot } from '../components/AdSenseSlot';
import { createAffCard } from '../components/AffCard';
import { createAffCardGrid } from '../components/AffCardGrid';
import { DEFAULT_AFFILIATE_CONFIG } from '../config/affiliateConfig';

export function renderGoodNewsAffSection(): string {
    const ecoCard = createAffCard({
        title: 'Eco Travel',
        subtitle: 'Sustainable Trips',
        description: 'Book eco-friendly accommodations and reduce your carbon footprint.',
        ctaText: 'Book Eco Hotels →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.ecoTravelBooking,
        icon: '🌿'
    });

    const expCard = createAffCard({
        title: 'Experiences',
        subtitle: 'Unique activities',
        description: 'Discover heartwarming local tours and unforgettable cultural experiences.',
        ctaText: 'Find Activities →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.goodNewsExperiences,
        icon: '🎁'
    });

    return `
        <div class="aff-section aff-good-news" style="margin-top: 32px; border-top: 1px solid var(--border-color, #333); padding-top: 16px;">
            <h3 style="color: var(--text-base, #fff); font-size: 1.1rem; margin-bottom: 16px;">Make a Positive Impact</h3>
            ${createAffCardGrid([ecoCard, expCard], 2)}
            ${createAdSenseSlot(DEFAULT_AFFILIATE_CONFIG.adsense.goodNews, '728px', '90px', 'Sponsored')}
        </div>
    `;
}
