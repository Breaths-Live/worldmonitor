/**
 * HeroSection — per-tab hero banner
 */
export interface HeroConfig {
    icon: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaAction: string;
}

export function createHeroSection(config: HeroConfig): string {
    return `
    <div class="lucky-hero" style="
      background: linear-gradient(135deg, rgba(68,136,255,0.1) 0%, rgba(102,68,255,0.08) 100%);
      border: 1px solid var(--border-color, #333);
      border-radius: 12px;
      padding: 24px 20px;
      margin: 12px 0 16px;
      text-align: center;
    ">
      <div style="font-size: 2rem; margin-bottom: 8px;">${config.icon}</div>
      <h2 style="margin: 0 0 6px; font-size: 1.2rem; color: var(--text-base, #fff); font-weight: 700;">${config.title}</h2>
      <p style="margin: 0 0 14px; font-size: 0.9rem; color: var(--text-muted, #aaa); line-height: 1.4;">${config.subtitle}</p>
      <button class="lucky-hero-cta" data-action="${config.ctaAction}" style="
        padding: 10px 24px;
        background: linear-gradient(135deg, #4488ff, #6644ff);
        color: #fff;
        border: none;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 600;
        cursor: pointer;
        min-height: 48px;
        transition: opacity 0.2s;
      ">${config.ctaText}</button>
    </div>
  `;
}
