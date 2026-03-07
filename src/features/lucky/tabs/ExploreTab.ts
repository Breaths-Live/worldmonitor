/**
 * ExploreTab — Bucketlist + Discover
 */
import { createHeroSection } from '../components/HeroSection';
import { createFilterBar } from '../components/FilterBar';
import { createDestinationCard, createDestinationGrid } from '../components/DestinationCard';
import { TRENDING_DESTINATIONS } from '../data/trending';

export function renderExploreTab(): string {
  const hero = createHeroSection({
    icon: '🌍',
    title: 'Điểm đến tiếp theo của bạn?',
    subtitle: 'Khám phá hàng trăm trải nghiệm đáng nhớ',
    ctaText: 'Xem Bucketlist của tôi →',
    ctaAction: 'open-bucketlist',
  });

  const filters = createFilterBar({
    filters: [
      { id: 'region', label: 'Khu vực', icon: '🌏', options: ['Đông Nam Á', 'Đông Á', 'Châu Âu', 'Châu Mỹ', 'Châu Phi', 'Trung Đông'] },
      { id: 'type', label: 'Loại', icon: '🏷️', options: ['Adventure', 'Culture', 'Food', 'Beach', 'Nature', 'Romance', 'Nightlife'] },
      { id: 'budget', label: 'Budget', icon: '💰', options: ['Free', 'Budget', 'Mid', 'Premium'] },
    ],
  });

  const cards = TRENDING_DESTINATIONS.map(d => createDestinationCard(d, 'explore'));

  return `
    <div class="lucky-tab lucky-explore" style="padding: 0 4px;">
      ${hero}
      ${filters}
      <h3 style="color: var(--text-base, #fff); font-size: 1rem; margin: 16px 0 12px; font-weight: 600;">
        TRENDING NOW
      </h3>
      ${createDestinationGrid(cards)}
      <div style="text-align: center; margin: 20px 0;">
        <a href="https://guide.breaths.live" target="_blank" rel="noopener" style="color: var(--accent-color, #4488ff); font-size: 0.9rem; text-decoration: none; font-weight: 500; display: inline-block; padding: 12px 24px;">
          Xem tất cả destinations →
        </a>
      </div>
    </div>
  `;
}
