import { createAdSenseSlot } from '../components/AdSenseSlot';
import { createAffCard } from '../components/AffCard';
import { createAffCardGrid } from '../components/AffCardGrid';
import { createBlogCard, createBlogCardGrid } from '../components/BlogCard';
import { createWidgetPlaceholder } from '../components/WidgetPlaceholder';
import { DEFAULT_AFFILIATE_CONFIG } from '../config/affiliateConfig';

export function renderWeatherAffSection(): string {
    const policyCard = createAffCard({
        title: 'VisitorsCoverage',
        subtitle: 'Travel Insure',
        description: 'Trip cancellation and extreme weather interruption insurance coverage.',
        ctaText: 'Get Covered →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.visitorsCoverage,
        icon: '☂️',
        badge: '$1–160 fixed'
    });

    const airaloCard = createAffCard({
        title: 'Airalo',
        subtitle: 'Stay Connected',
        description: 'Receive critical weather alerts instantly with seamless global data roaming.',
        ctaText: 'Get eSIM →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.airalo,
        icon: '📱',
        badge: '12% comm'
    });

    const vpnCard = createAffCard({
        title: 'NordVPN',
        subtitle: 'Safe Browsing',
        description: 'Secure open Wi-Fi connections while traveling through airports and hotels.',
        ctaText: 'Get VPN →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.nordVpnWeather,
        icon: '🔒',
        badge: '40–100% 🔥'
    });

    const blog1 = createBlogCard({
        title: 'Top Safest Climate Destinations 2026',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.blogSafestClimate
    });

    const blog2 = createBlogCard({
        title: 'Best Rain Gear for Travel',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.blogRainGear
    });

    const blog3 = createBlogCard({
        title: 'How to Track Storms in Real-Time',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.blogTrackStorms
    });

    return `
        <div class="aff-section aff-weather" style="margin-top: 32px; border-top: 1px solid var(--border-color, #333); padding-top: 16px;">
            <h3 style="color: var(--text-base, #fff); font-size: 1.1rem; margin-bottom: 16px;">Weather Preparedness</h3>
            ${createWidgetPlaceholder('expedia-banner-970x90', '100%', 'Weather delays? Book flexible tickets')}
            
            ${createAffCardGrid([policyCard, airaloCard, vpnCard], 3)}
            
            <h3 style="color: var(--text-base, #fff); font-size: 1.1rem; margin-top: 24px; margin-bottom: 16px;">Climate Survival Guides</h3>
            ${createBlogCardGrid([blog1, blog2, blog3])}
            
            ${createAdSenseSlot(DEFAULT_AFFILIATE_CONFIG.adsense.weather, '728px', '90px', 'Sponsored')}
        </div>
    `;
}
