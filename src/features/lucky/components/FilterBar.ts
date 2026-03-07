/**
 * FilterBar — location + type + budget filters
 */
export interface FilterBarConfig {
    filters: Array<{
        id: string;
        label: string;
        icon: string;
        options: string[];
    }>;
}

export function createFilterBar(config: FilterBarConfig): string {
    const filtersHtml = config.filters.map(f => `
    <div class="lucky-filter" style="position: relative;">
      <select data-filter="${f.id}" style="
        appearance: none;
        padding: 8px 28px 8px 12px;
        background: var(--bg-surface, #1a1a1a);
        color: var(--text-base, #fff);
        border: 1px solid var(--border-color, #333);
        border-radius: 8px;
        font-size: 0.82rem;
        cursor: pointer;
        min-height: 40px;
      ">
        <option value="">${f.icon} ${f.label} ▾</option>
        ${f.options.map(o => `<option value="${o}">${o}</option>`).join('')}
      </select>
    </div>
  `).join('');

    return `
    <div class="lucky-filter-bar" style="display: flex; gap: 8px; padding: 8px 0; flex-wrap: wrap; align-items: center;">
      ${filtersHtml}
    </div>
  `;
}
