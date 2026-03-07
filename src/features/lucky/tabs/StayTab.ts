/**
 * StayTab — Hotels curated
 */
import { createHeroSection } from '../components/HeroSection';
import { createFilterBar } from '../components/FilterBar';
import { createDestinationCard, createDestinationGrid } from '../components/DestinationCard';
import { TRENDING_DESTINATIONS } from '../data/trending';
import { buildAffiliateUrl } from '../../affiliate/config/affiliateLinks';

export function renderStayTab(): string {
  const hero = createHeroSection({
    icon: '🏨',
    title: 'Chỗ nghỉ được chọn lọc kỹ',
    subtitle: 'Phù hợp với route — không phải random',
    ctaText: 'Tìm theo ngày của tôi →',
    ctaAction: 'search-stay',
  });

  const filters = createFilterBar({
    filters: [
      { id: 'city', label: 'City', icon: '🏙️', options: ['Hội An', 'Tokyo', 'Santorini', 'Bali', 'Đà Nẵng', 'Bangkok'] },
      { id: 'checkin', label: 'Check-in', icon: '📅', options: ['Hôm nay', 'Tuần này', 'Tháng này', 'Tháng sau'] },
      { id: 'guests', label: 'Guests', icon: '👥', options: ['1', '2', '3-4', '5+'] },
      { id: 'budget', label: 'Budget', icon: '💰', options: ['Budget', 'Mid', 'Premium'] },
    ],
  });

  const stayCards = TRENDING_DESTINATIONS.slice(0, 6).map(d => {
    const card = { ...d };
    card.description = `Từ $${Math.floor(Math.random() * 80 + 20)}/đêm · Free cancel`;
    return createDestinationCard(card, 'stay');
  });

  return `
    <div class="lucky-tab lucky-stay" style="padding: 0 4px;">
      ${hero}
      ${filters}
      <h3 style="color: var(--text-base, #fff); font-size: 1rem; margin: 16px 0 12px; font-weight: 600;">
        CURATED PICKS
      </h3>
      ${createDestinationGrid(stayCards)}
      <div style="text-align: center; margin: 20px 0;">
        <a href="${buildAffiliateUrl('hotellook', 'lucky_stay_tab')}" target="_blank" rel="noopener" style="color: var(--accent-color, #4488ff); font-size: 0.9rem; text-decoration: none; font-weight: 500; display: inline-block; padding: 12px 24px;">
          Xem thêm khách sạn →
        </a>
      </div>
    </div>
  `;
}
