/**
 * TabNav — EXPLORE / STAY / DO / MOVE navigation
 */
export type LuckyTab = 'explore' | 'stay' | 'do' | 'move';

const TAB_CONFIG: Array<{ id: LuckyTab; label: string; icon: string }> = [
    { id: 'explore', label: 'EXPLORE', icon: '🌍' },
    { id: 'stay', label: 'STAY', icon: '🏨' },
    { id: 'do', label: 'DO', icon: '🎯' },
    { id: 'move', label: 'MOVE', icon: '✈️' },
];

export function createTabNav(activeTab: LuckyTab = 'explore'): string {
    const tabs = TAB_CONFIG.map(tab => {
        const isActive = tab.id === activeTab;
        return `
      <button class="lucky-tab-btn" data-lucky-tab="${tab.id}"
        style="
          display: flex; align-items: center; gap: 6px;
          padding: 8px 20px;
          background: ${isActive ? 'var(--accent-alpha, rgba(68,136,255,0.15))' : 'transparent'};
          color: ${isActive ? 'var(--accent-color, #4488ff)' : 'var(--text-muted, #aaa)'};
          border: 1px solid ${isActive ? 'var(--accent-color, #4488ff)' : 'var(--border-color, #333)'};
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: ${isActive ? '700' : '500'};
          cursor: pointer;
          transition: all 0.2s;
          min-height: 40px;
        ">
        <span>${tab.icon}</span>
        <span>${tab.label}</span>
      </button>
    `;
    }).join('');

    return `
    <nav class="lucky-tab-nav" style="display: flex; gap: 8px; padding: 12px 0; overflow-x: auto; -webkit-overflow-scrolling: touch;">
      ${tabs}
    </nav>
  `;
}
