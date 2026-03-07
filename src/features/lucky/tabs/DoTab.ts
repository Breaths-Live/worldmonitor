/**
 * DoTab — Tours & Activities (HIGH REVENUE)
 */
import { createHeroSection } from '../components/HeroSection';
import { createFilterBar } from '../components/FilterBar';
import { createDestinationCard, createDestinationGrid } from '../components/DestinationCard';
import { TRENDING_DESTINATIONS, ACTIVITY_CATEGORIES } from '../data/trending';
import { buildAffiliateUrl } from '../../affiliate/config/affiliateLinks';

export function renderDoTab(): string {
  const hero = createHeroSection({
    icon: '🎯',
    title: 'Những gì đáng làm nhất tại đây',
    subtitle: 'Tour riêng, lớp học, adventure — curated',
    ctaText: 'Xem theo điểm đến của tôi →',
    ctaAction: 'search-activities',
  });

  const filters = createFilterBar({
    filters: [
      { id: 'city', label: 'City', icon: '🏙️', options: ['Hội An', 'Tokyo', 'Santorini', 'Bali', 'Đà Nẵng', 'Bangkok'] },
      { id: 'type', label: 'Loại', icon: '🏷️', options: ['Tour', 'Class', 'Adventure', 'Food', 'Culture', 'Water', 'Nature'] },
      { id: 'price', label: 'Giá', icon: '💰', options: ['Free', '<$25', '$25-50', '$50-100', '>$100'] },
    ],
  });

  const categoriesHtml = ACTIVITY_CATEGORIES.map(cat =>
    `<button data-category="${cat.id}" style="
      padding: 8px 14px;
      background: var(--bg-surface, #1a1a1a);
      color: var(--text-muted, #aaa);
      border: 1px solid var(--border-color, #333);
      border-radius: 20px;
      font-size: 0.8rem;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    ">${cat.label}</button>`
  ).join('');

  const activityCards = TRENDING_DESTINATIONS.map(d => {
    const card = { ...d };
    card.description = `📍 ${d.location.city} · ⏱ ${Math.floor(Math.random() * 8 + 2)} tiếng · ★${d.rating ?? 4.5} (${Math.floor(Math.random() * 2000 + 100)} reviews)`;
    return createDestinationCard(card, 'do');
  });

  return `
    <div class="lucky-tab lucky-do" style="padding: 0 4px;">
      ${hero}
      ${filters}
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin: 12px 0; overflow-x: auto; -webkit-overflow-scrolling: touch;">
        ${categoriesHtml}
      </div>
      <h3 style="color: var(--text-base, #fff); font-size: 1rem; margin: 16px 0 12px; font-weight: 600;">
        FEATURED EXPERIENCES
      </h3>
      ${createDestinationGrid(activityCards)}
      <div style="text-align: center; margin: 20px 0;">
        <a href="${buildAffiliateUrl('getyourguide', 'lucky_do_tab')}" target="_blank" rel="noopener" style="color: var(--accent-color, #4488ff); font-size: 0.9rem; text-decoration: none; font-weight: 500; display: inline-block; padding: 12px 24px;">
          Xem tất cả tours →
        </a>
      </div>
    </div>
  `;
}
