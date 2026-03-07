import { createAdSenseSlot } from '../components/AdSenseSlot';
import { createAffCard } from '../components/AffCard';
import { createAffCardGrid } from '../components/AffCardGrid';
import { createBlogCard, createBlogCardGrid } from '../components/BlogCard';
import { createWidgetPlaceholder } from '../components/WidgetPlaceholder';
import { DEFAULT_AFFILIATE_CONFIG } from '../config/affiliateConfig';

export function renderTravelAffSection(): string {
    const discoverCarsCard = createAffCard({
        title: 'DiscoverCars',
        subtitle: 'Car Rental',
        description: 'Compare prices from over 500 suppliers to find the best car rental deals worldwide.',
        ctaText: 'Book Now →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.discoverCars,
        icon: '🚗',
        badge: '23–54% 🔥'
    });

    const gygCard = createAffCard({
        title: 'GetYourGuide',
        subtitle: 'Activities',
        description: 'Book unforgettable travel experiences, tours, and attraction tickets.',
        ctaText: 'Explore →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.getYourGuideTravel,
        icon: '🎟️',
        badge: '8% comm'
    });

    const kiwiTaxiCard = createAffCard({
        title: 'Kiwitaxi',
        subtitle: 'Airport Taxi',
        description: 'Book professional airport transfers in advance at fixed prices globally.',
        ctaText: 'Book Ride →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.kiwitaxi,
        icon: '🚕',
        badge: '9–11% comm'
    });

    const airaloCard = createAffCard({
        title: 'Airalo',
        subtitle: 'Travel eSIM',
        description: 'Download digital data packs for 200+ countries and borders instantly.',
        ctaText: 'Get eSIM →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.airalo,
        icon: '📱',
        badge: '12% comm'
    });

    const weGoTripCard = createAffCard({
        title: 'WeGoTrip',
        subtitle: 'Audio Tours',
        description: 'Self-guided audio tours and museum tickets created by local experts.',
        ctaText: 'Discover →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.weGoTrip,
        icon: '🎧',
        badge: '6–41% 🔥'
    });

    const expediaCard = createAffCard({
        title: 'Expedia',
        subtitle: 'Hotels+Flights',
        description: 'Bundle your flight and hotel together to save big on your next vacation.',
        ctaText: 'Search →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.expediaTravel,
        icon: '🏨',
        badge: 'Creator prog'
    });

    const blog1 = createBlogCard({
        title: 'Top 10 Bali Resorts',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.blogBaliResorts
    });

    const blog2 = createBlogCard({
        title: 'Visa Free Countries',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.blogVisaFree
    });

    const blog3 = createBlogCard({
        title: 'Best Travel eSIM 2026',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.blogTravelEsim
    });

    return `
        <div class="aff-section aff-travel" style="margin-top: 32px; border-top: 1px solid var(--border-color, #333); padding-top: 16px;">
            <h3 style="color: var(--text-base, #fff); font-size: 1.1rem; margin-bottom: 16px;">Start Planning Your Trip</h3>
            ${createWidgetPlaceholder('aviasales-search', '100%', 'Aviasales Flight Search')}
            ${createWidgetPlaceholder('hotellook-search', '100%', 'Hotellook Hotel Search')}
            
            <h3 style="color: var(--text-base, #fff); font-size: 1.1rem; margin-top: 24px; margin-bottom: 16px;">Transportation & Activities</h3>
            ${createAffCardGrid([discoverCarsCard, gygCard, kiwiTaxiCard], 3)}
            
            <h3 style="color: var(--text-base, #fff); font-size: 1.1rem; margin-top: 24px; margin-bottom: 16px;">Connectivity & Stays</h3>
            ${createAffCardGrid([airaloCard, weGoTripCard, expediaCard], 3)}
            
            <h3 style="color: var(--text-base, #fff); font-size: 1.1rem; margin-top: 24px; margin-bottom: 16px;">Travel Inspiration</h3>
            ${createBlogCardGrid([blog1, blog2, blog3])}
            
            ${createWidgetPlaceholder('expedia-banner-728x90', '100%', 'Expedia banner')}
            ${createAdSenseSlot(DEFAULT_AFFILIATE_CONFIG.adsense.travel, '728px', '90px', 'Sponsored')}
        </div>
    `;
}
