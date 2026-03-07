#!/usr/bin/env node
/**
 * Validate all required API keys in .env.local
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');

// Parse .env.local
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const [key, ...valueParts] = trimmed.split('=');
    envVars[key] = valueParts.join('=');
  }
});

// Define required keys
const requiredKeys = [
  { key: 'GROQ_API_KEY', section: 'AI Summarization', critical: true },
  { key: 'OPENROUTER_API_KEY', section: 'Fallback AI', critical: false },
  { key: 'UPSTASH_REDIS_REST_URL', section: 'Cache Layer', critical: true },
  { key: 'UPSTASH_REDIS_REST_TOKEN', section: 'Cache Auth', critical: true },
  { key: 'FINNHUB_API_KEY', section: 'Stock Quotes', critical: true },
  { key: 'FRED_API_KEY', section: 'Economic Data', critical: true },
  { key: 'EIA_API_KEY', section: 'Energy Data', critical: true },
  { key: 'WINGBITS_API_KEY', section: 'Aircraft Enrichment', critical: false },
  { key: 'ACLED_ACCESS_TOKEN', section: 'Conflict Events', critical: true },
  { key: 'ACLED_EMAIL', section: 'ACLED Email', critical: true },
  { key: 'CLOUDFLARE_API_TOKEN', section: 'Internet Outages', critical: false },
  { key: 'NASA_FIRMS_API_KEY', section: 'Fire Detection', critical: true },
  { key: 'AISSTREAM_API_KEY', section: 'Maritime AIS', critical: false },
  { key: 'OPENSKY_CLIENT_ID', section: 'Aircraft Tracking', critical: false },
  { key: 'OPENSKY_CLIENT_SECRET', section: 'Aircraft Secret', critical: false },
  { key: 'TELEGRAM_API_ID', section: 'Telegram Auth', critical: false },
  { key: 'TELEGRAM_API_HASH', section: 'Telegram Hash', critical: false },
  { key: 'TELEGRAM_SESSION', section: 'Telegram Session', critical: false },
  { key: 'WS_RELAY_URL', section: 'Relay Server', critical: false },
  { key: 'VITE_WS_RELAY_URL', section: 'Relay WebSocket', critical: false },
  { key: 'RELAY_SHARED_SECRET', section: 'Relay Auth', critical: false },
];

// Validate
console.log('\n' + '='.repeat(80));
console.log('API KEY VALIDATION REPORT');
console.log('='.repeat(80) + '\n');

let presentCount = 0;
let criticalCount = 0;
let missingCritical = [];
let missingOptional = [];

requiredKeys.forEach(({ key, section, critical }) => {
  const value = envVars[key];
  const isPresent = value && value.trim() !== '';
  const status = isPresent ? '✅' : '❌';
  const type = critical ? '[CRITICAL]' : '[optional]';
  
  console.log(`${status} ${type.padEnd(12)} ${key.padEnd(30)} (${section})`);
  
  if (isPresent) {
    presentCount++;
    if (critical) criticalCount++;
  } else {
    if (critical) {
      missingCritical.push(key);
    } else {
      missingOptional.push(key);
    }
  }
});

console.log('\n' + '='.repeat(80));
console.log(`SUMMARY: ${presentCount}/${requiredKeys.length} keys present`);
console.log(`Critical: ${criticalCount}/${requiredKeys.filter(k => k.critical).length} keys present`);
console.log('='.repeat(80) + '\n');

// Detailed report
if (missingCritical.length > 0) {
  console.log('🔴 CRITICAL MISSING (Must fix before deployment):');
  missingCritical.forEach(k => console.log(`   - ${k}`));
  console.log();
}

if (missingOptional.length > 0) {
  console.log('🟡 OPTIONAL MISSING (Nice to have):');
  missingOptional.forEach(k => console.log(`   - ${k}`));
  console.log();
}

// Key status details
console.log('📋 KEY STATUS DETAILS:\n');

const keyStatus = {
  'GROQ_API_KEY': envVars['GROQ_API_KEY'] ? '✅ Ready' : '❌ Missing',
  'UPSTASH_REDIS_REST_URL': envVars['UPSTASH_REDIS_REST_URL'] ? '✅ Configured' : '❌ Missing',
  'TELEGRAM_SESSION': !envVars['TELEGRAM_SESSION'] || envVars['TELEGRAM_SESSION'].trim() === '' ? '⚠️  Needs generation' : '✅ Present',
  'WS_RELAY_URL': envVars['WS_RELAY_URL'] ? '✅ Configured (not deployed)' : '❌ Missing',
  'WINGBITS_API_KEY': envVars['WINGBITS_API_KEY'] && envVars['WINGBITS_API_KEY'].includes('PLACEHOLDER') ? '⚠️  Placeholder (needs real key)' : 'Status unclear',
};

Object.entries(keyStatus).forEach(([key, status]) => {
  console.log(`${key}: ${status}`);
});

console.log('\n' + '='.repeat(80));
console.log('NEXT STEPS:');
console.log('='.repeat(80));
console.log(`
1. 🔴 CRITICAL - Deploy Railway Relay (WS_RELAY_URL)
   Commands: npm run relay:start

2. 🔴 CRITICAL - Verify GROQ key works
   Already configured ✓

3. 🟡 IMPORTANT - Generate Telegram Session
   Command: node scripts/telegram/session-auth.mjs

4. 🟡 IMPORTANT - Replace Wingbits placeholder key
   Register: https://developers.wingbits.com/

5. 🟢 OPTIONAL - Sync Enrichment API
   Command: npm run sync:enrichment
`);
