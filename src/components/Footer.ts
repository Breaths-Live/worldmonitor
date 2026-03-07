/**
 * Footer Compliance Component
 * Required credit: "Based on WorldMonitor by Elie Habib"
 * Hiển thị ở bottom mọi tab.
 */

export function createFooter(): string {
    return `
    <footer class="app-footer-compliance" style="
      position: relative;
      width: 100%;
      text-align: center;
      padding: 12px 16px 28px;
      background: var(--bg-base, #0a0a0a);
      border-top: 1px solid var(--border-color, #2a2a2a);
      font-size: 11px;
      color: var(--text-muted, #888);
      line-height: 1.6;
    ">
      <div>
        <a href="https://github.com/koala73/worldmonitor" target="_blank" rel="noopener" style="color: var(--accent-color, #4488ff); text-decoration: none;">Based on WorldMonitor by Elie Habib</a>
      </div>
    </footer>
  `;
}
