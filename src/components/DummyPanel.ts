import { Panel, type PanelOptions } from './Panel';

export class DummyPanel extends Panel {
    constructor(options: PanelOptions) {
        super(options);
        this.renderDummy();
    }

    private renderDummy(): void {
        // We can reuse the built-in loading spinner, 
        // but the task says "dummy, label + spinner OK" or "Coming Soon 🚧"
        let contentHtml = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 2rem; color: var(--text-muted); text-align: center;">
    `;

        if (this.panelId === 'sports-events') {
            contentHtml += `
        <div style="font-size: 2rem; margin-bottom: 1rem;">🚧</div>
        <div style="font-weight: 500;">Coming Soon</div>
      `;
        } else {
            contentHtml += `
        <div class="panel-loading-radar" style="margin-bottom: 1rem;">
          <div class="panel-radar-sweep"></div>
          <div class="panel-radar-dot"></div>
        </div>
        <div class="panel-loading-text" style="position: static; transform: none; margin-top: 10px;">${this.element.querySelector('.panel-title')?.textContent || 'Loading...'}</div>
      `;
        }

        contentHtml += `</div>`;
        this.setContent(contentHtml);
    }
}
