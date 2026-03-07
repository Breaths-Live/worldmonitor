export function createWidgetPlaceholder(id: string, width: string = '100%', label: string = 'Widget Placeholder'): string {
    return `
        <div id="${id}" class="widget-placeholder" style="width: ${width}; min-height: 120px; border: 2px dashed var(--border-color, #444); background: var(--bg-surface-secondary, #1a1a1a); display: flex; align-items: center; justify-content: center; margin: 20px 0; border-radius: 8px;">
            <div style="text-align: center; color: var(--text-muted, #aaa);">
                <span style="display: block; font-size: 1.5rem; margin-bottom: 8px;">🧩</span>
                <span style="font-family: monospace; font-size: 0.9rem;">${label}</span>
                <div style="font-size: 0.75rem; margin-top: 4px; opacity: 0.7;">id="${id}"</div>
            </div>
        </div>
    `;
}
