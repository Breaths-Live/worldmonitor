export interface BlogCardProps {
    title: string;
    imageUrl?: string;
    ctaUrl: string;
}

export function createBlogCard(props: BlogCardProps): string {
    const bgImage = props.imageUrl ? `url('${props.imageUrl}')` : 'linear-gradient(45deg, #2a2a2a, #3a3a3a)';

    return `
        <a href="${props.ctaUrl}" target="_blank" rel="noopener noreferrer" class="blog-card" style="display: flex; flex-direction: column; overflow: hidden; background: var(--bg-surface, #1a1a1a); border: 1px solid var(--border-color, #333); border-radius: 8px; text-decoration: none; color: inherit; transition: transform 0.2s, border-color 0.2s; min-height: 180px;">
            <div style="height: 120px; background: ${bgImage}; background-size: cover; background-position: center;"></div>
            <div style="padding: 12px; display: flex; flex-direction: column; flex-grow: 1;">
                <h4 style="margin: 0; font-size: 1rem; color: var(--text-base, #fff); line-height: 1.4; flex-grow: 1;">${props.title}</h4>
                <div style="margin-top: 8px; font-size: 0.8rem; color: var(--accent-color, #4488ff); font-weight: 500; display: flex; align-items: center;">
                    Read Article <span style="margin-left: 4px;">→</span>
                </div>
            </div>
        </a>
    `;
}

export function createBlogCardGrid(cardsHtml: string[]): string {
    return `
        <div class="blog-card-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 20px 0;">
            ${cardsHtml.join('')}
        </div>
    `;
}
