import { createAdSenseSlot } from '../components/AdSenseSlot';
import { createAffCard } from '../components/AffCard';
import { createAffCardGrid } from '../components/AffCardGrid';
import { createBlogCard, createBlogCardGrid } from '../components/BlogCard';
import { createWidgetPlaceholder } from '../components/WidgetPlaceholder';
import { DEFAULT_AFFILIATE_CONFIG } from '../config/affiliateConfig';

export function renderSportsAffSection(): string {
    const ticketCard = createAffCard({
        title: 'TicketNet',
        subtitle: 'Event Tickets',
        description: 'Official tickets and VIP packages for premier global sporting events.',
        ctaText: 'Get Tickets →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.ticketNet,
        icon: '🎟️',
        badge: '6–12.5% 🔥'
    });

    const hotelCard = createAffCard({
        title: 'Booking.com',
        subtitle: 'Hotels & Venues',
        description: 'Find accommodations walking distance from major stadiums and arenas.',
        ctaText: 'Book Hotel →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.bookingSports,
        icon: '🏨',
        badge: '3–5% comm'
    });

    const expediaCard = createAffCard({
        title: 'Expedia',
        subtitle: 'Match Travel',
        description: 'Complete flight, hotel, and car rental packages for the big game.',
        ctaText: 'Plan Trip →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.expediaSports,
        icon: '✈️',
        badge: 'Creator prog'
    });

    const blog1 = createBlogCard({
        title: 'UEFA 2026 Travel Guide',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.blogUefaGuide
    });

    const blog2 = createBlogCard({
        title: 'Best Sports Streaming VPN',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.blogSportsVpn
    });

    const blog3 = createBlogCard({
        title: 'Top 10 Stadiums to Visit',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.blogTopStadiums
    });

    return `
        <div class="aff-section aff-sports" style="margin-top: 32px; border-top: 1px solid var(--border-color, #333); padding-top: 16px;">
            <h3 style="color: var(--text-base, #fff); font-size: 1.1rem; margin-bottom: 16px;">Sports Experiences</h3>
            ${createWidgetPlaceholder('gyg-activity-sports', '100%', 'GetYourGuide "Sports Events near you"')}
            
            ${createAffCardGrid([ticketCard, hotelCard, expediaCard], 3)}
            
            <h3 style="color: var(--text-base, #fff); font-size: 1.1rem; margin-top: 24px; margin-bottom: 16px;">Ultimate Fan Guides</h3>
            ${createBlogCardGrid([blog1, blog2, blog3])}
            
            ${createAdSenseSlot(DEFAULT_AFFILIATE_CONFIG.adsense.sports, '728px', '90px', 'Sponsored')}
        </div>
    `;
}
