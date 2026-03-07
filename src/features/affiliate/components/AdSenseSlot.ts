export function createAdSenseSlot(slotId: string, width: string = '728px', height: string = '90px', label: string = 'Sponsored'): string {
    return `
        <div class="adsense-slot-container" style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 24px 0;">
            <div style="font-size: 0.7rem; color: var(--text-muted, #aaa); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">${label}</div>
            <div id="adsense-${slotId}" style="width: ${width}; max-width: 100%; height: ${height}; background: var(--bg-surface-secondary, #222); border: 1px solid var(--border-color, #333); display: flex; align-items: center; justify-content: center; color: var(--text-muted, #aaa);">
                <!-- AdSense Script will be injected here -->
                <span style="font-size: 0.8rem; opacity: 0.5;">AdSense ${slotId}</span>
            </div>
        </div>
    `;
}
