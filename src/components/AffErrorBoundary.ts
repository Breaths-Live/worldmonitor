/**
 * Error Boundary for Affiliate Sections
 * Wraps affiliate rendering in try/catch to prevent page crashes.
 * If a widget/section throws, it shows a graceful fallback.
 */

export function safeRenderAffSection(renderFn: () => string, sectionName: string): string {
    try {
        return renderFn();
    } catch (err) {
        console.error(`[AffErrorBoundary] ❌ Error rendering "${sectionName}":`, err);
        return `
      <div class="aff-error-boundary" style="padding: 24px; text-align: center; color: var(--text-muted, #888); border: 1px dashed var(--border-color, #444); border-radius: 8px; margin: 20px 0;">
        <div style="font-size: 1.5rem; margin-bottom: 8px;">⚠️</div>
        <div style="font-size: 0.9rem;">Unable to load ${sectionName}</div>
        <div style="font-size: 0.75rem; margin-top: 4px; opacity: 0.6;">This section encountered an error and was safely hidden.</div>
      </div>
    `;
    }
}
