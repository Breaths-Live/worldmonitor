import { createAdSenseSlot } from '../components/AdSenseSlot';
import { DEFAULT_AFFILIATE_CONFIG } from '../config/affiliateConfig';

export function renderWorldAffSection(): string {
    return `
        <div class="aff-section aff-world" style="margin-top: 32px; border-top: 1px solid var(--border-color, #333); padding-top: 16px;">
            ${createAdSenseSlot(DEFAULT_AFFILIATE_CONFIG.adsense.world, '728px', '90px', 'Sponsored')}
        </div>
    `;
}
