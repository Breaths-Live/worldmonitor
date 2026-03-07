/**
 * DestinationCard — shared card component used across all 4 Lucky tabs.
 * Renders a destination with image, weather badge, tags, rating, and affiliate CTAs.
 */
import type { TrendingDestination } from '../data/trending';

export function createDestinationCard(dest: TrendingDestination, variant: 'explore' | 'stay' | 'do' | 'move' = 'explore'): string {
    const weatherBadge = dest.weather
        ? `<span style="position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.7); color: #fff; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; backdrop-filter: blur(4px);">${dest.weather.icon} ${dest.weather.temp}°C</span>`
        : '';

    const ratingHtml = dest.rating
        ? `<span style="color: #ffc107; font-size: 0.8rem;">★${dest.rating}</span>`
        : '';

    const tagsHtml = dest.tags.map(t =>
        `<span style="background: var(--bg-surface-secondary, #222); color: var(--text-muted, #aaa); padding: 2px 8px; border-radius: 10px; font-size: 0.7rem;">${t}</span>`
    ).join('');

    const priceColor: Record<string, string> = { Free: '#4caf50', Budget: '#8bc34a', Mid: '#ff9800', Premium: '#e91e63' };

    const bgImage = dest.image
        ? `url('${dest.image}')`
        : `linear-gradient(135deg, #1a2a3a 0%, #2a3a4a 50%, #1a2a3a 100%)`;

    // Build CTA based on variant
    let ctaHtml = '';
    switch (variant) {
        case 'explore':
            ctaHtml = `
        <div style="display: flex; gap: 6px; margin-top: 10px;">
          ${dest.affiliate.tours ? `<a href="${dest.affiliate.tours}" target="_blank" rel="noopener" style="flex: 1; text-align: center; padding: 8px; background: var(--accent-alpha, rgba(68,136,255,0.15)); color: var(--accent-color, #4488ff); border-radius: 6px; font-size: 0.8rem; font-weight: 600; text-decoration: none;">Xem chi tiết</a>` : ''}
          <button style="padding: 8px 12px; background: transparent; border: 1px solid var(--border-color, #444); color: var(--text-muted, #aaa); border-radius: 6px; font-size: 0.75rem; cursor: pointer;">+ Bucketlist</button>
        </div>`;
            break;
        case 'stay':
            ctaHtml = dest.affiliate.hotel
                ? `<a href="${dest.affiliate.hotel}" target="_blank" rel="noopener" style="display: block; text-align: center; padding: 10px; background: var(--accent-alpha, rgba(68,136,255,0.15)); color: var(--accent-color, #4488ff); border-radius: 6px; font-size: 0.85rem; font-weight: 600; text-decoration: none; margin-top: 10px;">Xem phòng & giá →</a>`
                : '';
            break;
        case 'do':
            ctaHtml = dest.affiliate.tours
                ? `<a href="${dest.affiliate.tours}" target="_blank" rel="noopener" style="display: block; text-align: center; padding: 10px; background: linear-gradient(135deg, #4488ff, #6644ff); color: #fff; border-radius: 6px; font-size: 0.85rem; font-weight: 600; text-decoration: none; margin-top: 10px;">🎟️ Xem & đặt tour →</a>`
                : '';
            break;
        case 'move':
            ctaHtml = dest.affiliate.flights
                ? `<a href="${dest.affiliate.flights}" target="_blank" rel="noopener" style="display: block; text-align: center; padding: 10px; background: var(--accent-alpha, rgba(68,136,255,0.15)); color: var(--accent-color, #4488ff); border-radius: 6px; font-size: 0.85rem; font-weight: 600; text-decoration: none; margin-top: 10px;">✈️ Tìm chuyến bay →</a>`
                : '';
            break;
    }

    return `
    <div class="destination-card" data-subid="${dest.subIdPrefix}" style="background: var(--bg-surface, #1a1a1a); border: 1px solid var(--border-color, #333); border-radius: 12px; overflow: hidden; transition: transform 0.2s, box-shadow 0.2s;">
      <div style="position: relative; height: 140px; background: ${bgImage}; background-size: cover; background-position: center;">
        ${weatherBadge}
        <span style="position: absolute; bottom: 8px; left: 8px; background: ${priceColor[dest.priceRange] ?? '#888'}; color: #fff; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem; font-weight: 600;">${dest.priceRange}</span>
      </div>
      <div style="padding: 12px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
          <h4 style="margin: 0; font-size: 1rem; color: var(--text-base, #fff);">${dest.name}</h4>
          ${ratingHtml}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted, #aaa); margin-bottom: 6px;">
          ${dest.location.countryFlag} ${dest.location.country}
        </div>
        <p style="margin: 0 0 8px; font-size: 0.82rem; color: var(--text-secondary, #ccc); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${dest.description}</p>
        <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 4px;">${tagsHtml}</div>
        ${ctaHtml}
      </div>
    </div>
  `;
}

export function createDestinationGrid(cards: string[]): string {
    return `
    <div class="destination-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; margin: 16px 0;">
      ${cards.join('')}
    </div>
  `;
}
