/**
 * EmptyState — shown when filter returns no results, displays trending fallback
 */
import { TRENDING_DESTINATIONS } from '../data/trending';
import { createDestinationCard, createDestinationGrid } from './DestinationCard';

export function createEmptyState(message: string = 'Chưa có điểm đến nào phù hợp 🗺️'): string {
    const trendingCards = TRENDING_DESTINATIONS.slice(0, 3).map(d =>
        createDestinationCard(d, 'explore')
    );

    return `
    <div class="lucky-empty-state" style="text-align: center; padding: 32px 16px;">
      <div style="font-size: 2.5rem; margin-bottom: 12px;">🗺️</div>
      <h3 style="margin: 0 0 8px; color: var(--text-base, #fff); font-size: 1.1rem;">${message}</h3>
      <p style="margin: 0 0 20px; color: var(--text-muted, #aaa); font-size: 0.85rem;">
        Thử xem Top trending hôm nay:
      </p>
      ${createDestinationGrid(trendingCards)}
    </div>
  `;
}
