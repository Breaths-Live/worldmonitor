import { Panel } from './Panel';
import { escapeHtml } from '@/utils/sanitize';
import { t } from '@/services/i18n';
import type { CyberThreatsResponse, CyberThreatAlert } from '@/services/cyber-threats';

export class CyberThreatsPanel extends Panel {
    private alerts: CyberThreatAlert[] = [];

    constructor() {
        super({
            id: 'cyber-threats',
            title: t('panels.cyberThreats'),
            showCount: true,
            trackActivity: true,
            infoTooltip: t('components.cyberThreats.infoTooltip'),
        });
        this.showLoading(t('components.cyberThreats.checking'));
    }

    public setData(data: CyberThreatsResponse): void {
        if (!data.configured) {
            this.setContent(`<div class="panel-empty">${t('components.cyberThreats.notConfigured')}</div>`);
            this.setCount(0);
            return;
        }

        const prevCount = this.alerts.length;
        this.alerts = data.alerts || [];
        this.setCount(this.alerts.length);

        if (prevCount === 0 && this.alerts.length > 0) {
            this.setNewBadge(this.alerts.length);
        }

        this.render();
    }

    private formatAlertTime(dateStr: string): string {
        try {
            const ts = new Date(dateStr).getTime();
            if (!Number.isFinite(ts)) return '';
            const diff = Date.now() - ts;
            if (diff < 60_000) return t('components.cyberThreats.justNow');
            const mins = Math.floor(diff / 60_000);
            if (mins < 60) return `${mins}m`;
            const hours = Math.floor(mins / 60);
            if (hours < 24) return `${hours}h`;
            return `${Math.floor(hours / 24)}d`;
        } catch {
            return '';
        }
    }

    private render(): void {
        if (this.alerts.length === 0) {
            this.setContent(`
        <div class="oref-panel-content">
          <div class="oref-status oref-ok">
            <span class="oref-status-icon">&#x2705;</span>
            <span>${t('components.cyberThreats.noAlerts')}</span>
          </div>
        </div>
      `);
            return;
        }

        const alertRows = this.alerts.map(alert => {
            const time = this.formatAlertTime(alert.pubDate);
            const isCisa = alert.source.toUpperCase() === 'CISA';
            const badgeClass = isCisa ? 'source-badge cisa' : 'source-badge thn';

            return `<div class="oref-alert-row">
        <div class="oref-alert-header" style="display:flex; justify-content:space-between; align-items:flex-start;">
          <a href="${escapeHtml(alert.link)}" target="_blank" rel="noopener noreferrer" class="oref-alert-title" style="text-decoration:none; color:inherit;">
            <span class="${badgeClass}" style="font-size: 0.7em; padding: 2px 4px; border-radius: 3px; background: rgba(255,255,255,0.1); margin-right: 6px;">${escapeHtml(alert.source)}</span>
            ${escapeHtml(alert.title)}
          </a>
          <span class="oref-alert-time" style="white-space:nowrap; margin-left:8px;">${time}</span>
        </div>
        <div class="oref-alert-areas" style="margin-top:4px; font-size:0.85em; opacity:0.8; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${escapeHtml(alert.desc)}</div>
      </div>`;
        }).join('');

        this.setContent(`
      <div class="oref-panel-content" style="max-height: 500px; overflow-y: auto;">
        <div class="oref-status oref-danger">
          <span class="oref-pulse" style="background-color: #ff3333;"></span>
          <span>${t('components.cyberThreats.activeAlerts', { count: String(this.alerts.length) })}</span>
        </div>
        <div class="oref-list">${alertRows}</div>
      </div>
    `);
    }
}
