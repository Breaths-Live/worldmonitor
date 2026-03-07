export function createAffCardGrid(cardsHtml: string[], _columns: number = 3): string {
    return `
        <div class="aff-card-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 20px 0;">
            ${cardsHtml.join('')}
        </div>
    `;
}
