import { createHeroSection } from '../components/HeroSection';
import { createAffCard } from '../../affiliate/components/AffCard';
import { createAffCardGrid } from '../../affiliate/components/AffCardGrid';
import { createWidgetPlaceholder } from '../../affiliate/components/WidgetPlaceholder';
import { createAdSenseSlot } from '../../affiliate/components/AdSenseSlot';
import { buildAffiliateUrl } from '../../affiliate/config/affiliateLinks';
import { TRENDING_DESTINATIONS } from '../data/trending';
import { createDestinationCard, createDestinationGrid } from '../components/DestinationCard';

export interface DestinationPageProps {
    id: string;
    name: string;
    description: string;
}

export function renderDestinationPage(dest: DestinationPageProps): string {
    // 1. Explore (Hero Intro)
    const hero = createHeroSection({
        icon: '📍',
        title: `${dest.name} — Khám phá điểm đến`,
        subtitle: dest.description,
        ctaText: 'Lưu vào Bucketlist →',
        ctaAction: `save-dest-${dest.id}`,
    });

    // 2. Move (Quick Prep & Transport)
    const prepCards = [
        createAffCard({
            title: 'Airalo eSIM',
            subtitle: 'Online ngay khi hạ cánh',
            description: 'Giữ kết nối thông suốt với các gói data linh hoạt.',
            ctaText: 'Mua eSIM →',
            ctaUrl: buildAffiliateUrl('airalo', `lucky_dest_prep_${dest.id}`),
            icon: '📱',
            badge: 'Must-have',
        }),
        createAffCard({
            title: 'SafetyWing',
            subtitle: 'Bảo hiểm du lịch',
            description: 'Bảo vệ rủi ro y tế và chuyến đi cho digital nomads.',
            ctaText: 'Xem bảo hiểm →',
            ctaUrl: buildAffiliateUrl('safetywing', `lucky_dest_prep_${dest.id}`),
            icon: '☂️',
            badge: 'An tâm',
        }),
    ];

    // 3. AdSense Slot 1: Chèn QC xen giữa Prep và Stay
    const adsSlot1 = createAdSenseSlot(`dest_${dest.id}_top`, '100%', '100px', 'Advertisement');

    // 4. Stay (Khách sạn)
    const stayCards = TRENDING_DESTINATIONS.slice(0, 3).map(d => {
        const card = { ...d, name: `${d.name} tại ${dest.name}` };
        card.description = `Từ $${Math.floor(Math.random() * 80 + 20)}/đêm · Review tốt`;
        return createDestinationCard(card, 'stay');
    });

    // 5. AdSense Slot 2
    const adsSlot2 = createAdSenseSlot(`dest_${dest.id}_mid`, '100%', '100px', 'Advertisement');

    // 6. Do (Trải nghiệm)
    const doCards = TRENDING_DESTINATIONS.slice(3, 6).map(d => {
        const card = { ...d, name: `Tour tham quan ${d.name}` };
        card.description = `⏱ ${Math.floor(Math.random() * 8 + 2)} tiếng · ★${d.rating ?? 4.5}`;
        return createDestinationCard(card, 'do');
    });

    // UX Rules check: 
    // CTA paddings are handled in the component templates or injected css. We add inline styles where raw elements are used.

    return `
    <div class="lucky-destination-page" style="padding: 0 4px; padding-bottom: 80px;">
        ${hero}

        <section class="dest-section prep-section" style="margin-top: 24px;">
            <h3 style="color: var(--text-base, #fff); font-size: 1.1rem; margin: 0 0 16px; font-weight: 600;">
                🎒 Chuẩn bị sẵn sàng
            </h3>
            ${createAffCardGrid(prepCards, 2)}
        </section>

        ${adsSlot1}

        <section class="dest-section stay-section" style="margin-top: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px;">
                 <h3 style="color: var(--text-base, #fff); font-size: 1.1rem; margin: 0; font-weight: 600;">
                    🏨 Chỗ nghỉ gợi ý
                </h3>
                <a href="${buildAffiliateUrl('hotellook', `lucky_dest_stay_${dest.id}`)}" target="_blank" rel="noopener" style="color: var(--accent-color, #4488ff); font-size: 0.85rem; text-decoration: none; padding: 8px 12px; font-weight: 500;">Xem tất cả</a>
            </div>
            ${createWidgetPlaceholder(`agoda-search-${dest.id}`, '100%', 'Agoda / Booking Form Slot')}
            <div style="margin-top: 16px;">
                ${createDestinationGrid(stayCards)}
            </div>
        </section>

        ${adsSlot2}

        <section class="dest-section do-section" style="margin-top: 24px;">
             <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px;">
                 <h3 style="color: var(--text-base, #fff); font-size: 1.1rem; margin: 0; font-weight: 600;">
                    🎯 Trải nghiệm Must-Do
                </h3>
                 <a href="${buildAffiliateUrl('getyourguide', `lucky_dest_do_${dest.id}`)}" target="_blank" rel="noopener" style="color: var(--accent-color, #4488ff); font-size: 0.85rem; text-decoration: none; padding: 8px 12px; font-weight: 500;">Tất cả Tours</a>
            </div>
            ${createDestinationGrid(doCards)}
        </section>
        
        <div style="text-align: center; margin: 32px 0;">
            <button class="lucky-primary-btn" style="background: var(--accent-color, #4488ff); color: white; border: none; padding: 14px 32px; font-size: 1rem; border-radius: 8px; font-weight: 600; cursor: pointer;">
                Thêm điểm đến này vào Plan
            </button>
        </div>
    </div>
    `;
}
