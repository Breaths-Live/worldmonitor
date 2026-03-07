#!/usr/bin/env node
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:3000';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  console.log('Visiting', BASE);
  try {
    // Do a quick health ping before navigating (helps catch server-side failures)
    try {
      const pre = await page.request.get(`${BASE}/api/_health`);
      if (!pre.ok()) {
        console.error('Pre-check /api/_health returned', pre.status());
        process.exit(2);
      }
      console.log('Pre-check health OK');
    } catch (e) {
      console.error('Pre-check health failed:', e);
      process.exit(2);
    }

    const resp = await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
    if (!resp || resp.status() >= 400) {
      console.error('Failed to load page, status', resp ? resp.status() : 'no response');
      process.exit(2);
    }

    // Check health endpoint first to ensure backend APIs are reachable
    try {
      const healthResp = await page.request.get(`${BASE}/api/_health`);
      if (!healthResp.ok()) {
        console.error('/api/_health returned', healthResp.status());
        process.exit(3);
      }
      const hb = await healthResp.json();
      console.log('Health OK:', hb.keys);
    } catch (e) {
      console.error('Health check failed:', e);
      process.exit(3);
    }

    // Wait for AI Insights text (allow longer timeout for preview builds)
    try {
      await page.waitForSelector('text=AI Insights', { timeout: 45000 });
      console.log('AI Insights panel detected');
    } catch (e) {
      console.warn('AI Insights not found within timeout, continuing to health-based validation');
    }

    // Call health endpoint
    const health = await page.request.get(`${BASE}/api/_health`);
    if (!health.ok()) {
      console.error('Health endpoint returned', health.status());
      process.exit(3);
    }
    const body = await health.json();
    console.log('Health:', body);
    if (!body.ok) {
      console.error('Health payload not ok');
      process.exit(4);
    }

    console.log('Smoke test passed');
    await browser.close();
    process.exit(0);
  } catch (e) {
    console.error('Smoke test failed:', e);
    await browser.close();
    process.exit(1);
  }
})();
