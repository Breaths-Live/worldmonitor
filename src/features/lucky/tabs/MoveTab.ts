/**
 * MoveTab — Flights + Transport + eSIM
 */
import { createHeroSection } from '../components/HeroSection';
import { createAffCard } from '../../affiliate/components/AffCard';
import { createAffCardGrid } from '../../affiliate/components/AffCardGrid';
import { createWidgetPlaceholder } from '../../affiliate/components/WidgetPlaceholder';
import { buildAffiliateUrl } from '../../affiliate/config/affiliateLinks';

export function renderMoveTab(): string {
  const hero = createHeroSection({
    icon: '✈️',
    title: 'Di chuyển thông minh',
    subtitle: 'So sánh vé, thuê xe, eSIM — 1 nơi',
    ctaText: 'Tìm chuyến bay →',
    ctaAction: 'search-flights',
  });

  const transportCards = [
    createAffCard({
      title: 'DiscoverCars',
      subtitle: 'Thuê xe',
      description: 'So sánh giá từ 500+ nhà cho thuê xe trên toàn thế giới.',
      ctaText: 'So sánh →',
      ctaUrl: buildAffiliateUrl('discovercars', 'lucky_move_transport'),
      icon: '🚗',
      badge: '23–54% 🔥',
    }),
    createAffCard({
      title: 'Kiwitaxi',
      subtitle: 'Đón sân bay',
      description: 'Đặt trước xe đón sân bay với giá cố định toàn cầu.',
      ctaText: 'Đặt ngay →',
      ctaUrl: buildAffiliateUrl('kiwitaxi', 'lucky_move_transport'),
      icon: '🚕',
      badge: '9–11%',
    }),
    createAffCard({
      title: 'Omio',
      subtitle: 'Bus/Train',
      description: 'Tìm vé bus, tàu hỏa, và xe khách giá tốt nhất châu Âu.',
      ctaText: 'Tìm vé →',
      ctaUrl: '#',
      icon: '🚌',
      badge: '6–8%',
    }),
  ];

  const prepCards = [
    createAffCard({
      title: 'Airalo',
      subtitle: 'eSIM 200+ nước',
      description: 'Tải app, chọn gói data, online ngay khi hạ cánh.',
      ctaText: 'Mua ngay →',
      ctaUrl: buildAffiliateUrl('airalo', 'lucky_move_prep'),
      icon: '📱',
      badge: '12% comm',
    }),
    createAffCard({
      title: 'SafetyWing',
      subtitle: 'Insurance',
      description: 'Bảo hiểm y tế du lịch cho nomad và remote worker.',
      ctaText: 'Xem gói →',
      ctaUrl: buildAffiliateUrl('safetywing', 'lucky_move_prep'),
      icon: '☂️',
      badge: '10–20%',
    }),
  ];

  return `
    <div class="lucky-tab lucky-move" style="padding: 0 4px;">
      ${hero}

      <h3 style="color: var(--text-base, #fff); font-size: 1rem; margin: 16px 0 12px; font-weight: 600;">
        ✈️ Chuyến bay
      </h3>
      ${createWidgetPlaceholder('aviasales-search-lucky', '100%', 'Aviasales Flight Search Widget')}

      <h3 style="color: var(--text-base, #fff); font-size: 1rem; margin: 20px 0 12px; font-weight: 600;">
        🚗 Di chuyển mặt đất
      </h3>
      ${createAffCardGrid(transportCards, 3)}

      <h3 style="color: var(--text-base, #fff); font-size: 1rem; margin: 20px 0 12px; font-weight: 600;">
        🎒 Chuẩn bị trước chuyến đi
      </h3>
      ${createAffCardGrid(prepCards, 2)}
    </div>
  `;
}
