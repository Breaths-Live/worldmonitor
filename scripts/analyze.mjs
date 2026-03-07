import { chromium } from '@playwright/test';
import fs from 'fs';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const requests = new Set();
    page.on('request', request => {
        const url = request.url();
        if (url.includes('api') || url.includes('.json') || url.includes('.csv') || url.includes('.xml') || url.includes('/data/')) {
            requests.add(url);
        }
    });

    console.log('Navigating to https://www.worldmonitor.app/ ...');
    await page.goto('https://www.worldmonitor.app/', { waitUntil: 'networkidle', timeout: 60000 });

    console.log('Waiting for panels to load...');
    await page.waitForTimeout(10000); // Wait 10s for dynamic content

    const panels = await page.evaluate(() => {
        const panelEls = document.querySelectorAll('.panel-wrapper, .panel');
        const result = [];
        panelEls.forEach(panel => {
            const title = panel.querySelector('.panel-title')?.textContent?.trim() || 'Unknown Title';
            const id = panel.id || panel.getAttribute('data-id') || 'Unknown ID';
            const type = panel.getAttribute('data-type') || 'Unknown Type';
            result.push({ title, id, type });
        });
        return result;
    });

    let output = '--- PANELS ---\n';
    panels.forEach(p => output += `- ${p.title} (ID: ${p.id}, Type: ${p.type})\n`);

    output += '\n--- API CALLS ---\n';
    Array.from(requests).sort().forEach(url => {
        // filter out some noisy ones like map tiles
        if (!url.includes('basemaps.cartocdn.com') && !url.includes('tile.openstreetmap.org')) {
            output += url + '\n';
        }
    });

    fs.writeFileSync('scripts/analyze-results.txt', output);
    console.log('Results written to scripts/analyze-results.txt');

    await browser.close();
})();
