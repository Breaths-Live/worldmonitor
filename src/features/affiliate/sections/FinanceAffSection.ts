import { createAdSenseSlot } from '../components/AdSenseSlot';
import { createAffCard } from '../components/AffCard';
import { createAffCardGrid } from '../components/AffCardGrid';
import { DEFAULT_AFFILIATE_CONFIG } from '../config/affiliateConfig';

export function renderFinanceAffSection(): string {
    const cryptoCard = createAffCard({
        title: 'Binance / eToro',
        subtitle: 'Trade crypto & stocks',
        description: 'Secure platform for trading digital assets and global stock markets.',
        ctaText: 'Start Trading →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.binance,
        icon: '🪙',
        badge: 'CPA aff'
    });

    const wiseCard = createAffCard({
        title: 'Wise',
        subtitle: 'Send money abroad',
        description: 'International money transfers with real exchange rates and low fees.',
        ctaText: 'Transfer Now →',
        ctaUrl: DEFAULT_AFFILIATE_CONFIG.links.wise,
        icon: '💸',
        badge: '$15–50 fixed'
    });

    return `
        <div class="aff-section aff-finance" style="margin-top: 32px; border-top: 1px solid var(--border-color, #333); padding-top: 16px;">
            <h3 style="color: var(--text-base, #fff); font-size: 1.1rem; margin-bottom: 16px;">Financial Tools</h3>
            ${createAffCardGrid([cryptoCard, wiseCard], 2)}
            ${createAdSenseSlot(DEFAULT_AFFILIATE_CONFIG.adsense.finance, '728px', '90px', 'Sponsored')}
        </div>
    `;
}
