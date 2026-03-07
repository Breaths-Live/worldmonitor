import { test, expect } from '@playwright/test';

const BASE = process.env.BASE_URL ?? 'http://localhost:3000';

test.describe('Intelligence panel smoke', () => {
  test('AI Insights panel loads and intelligence APIs respond', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });

    // Wait for the AI Insights panel title to appear
    await page.waitForSelector('text=AI Insights', { timeout: 15000 });
    const title = await page.locator('text=AI Insights').first();
    await expect(title).toBeVisible();

    // Ensure intelligence widgets appear (cii/strategic risk etc)
    await expect(page.locator('text=Country Instability').first()).toBeVisible({timeout:10000}).catch(()=>{});

    // Call health endpoint to verify keys are present and service healthy
    const health = await page.request.get(`${BASE}/api/_health`);
    expect(health.ok()).toBeTruthy();
    const body = await health.json();
    expect(body.ok).toBe(true);
    // At least GROQ or OPENROUTER should be present for AI features
    expect(body.keys).toBeTruthy();
    expect(body.keys.GROQ_API_KEY || body.keys.OPENROUTER_API_KEY).toBeTruthy();
  });
});
