#!/usr/bin/env node
/**
 * API Verification Script
 * Tests all configured APIs to verify they're working
 * Usage: node scripts/verify-apis.mjs
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}${colors.bright}═══ ${msg} ═══${colors.reset}\n`),
};

async function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  if (!fs.existsSync(envPath)) {
    log.error(`.env.local not found at ${envPath}`);
    process.exit(1);
  }

  const env = {};
  const content = fs.readFileSync(envPath, 'utf-8');
  
  content.split('\n').forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      env[match[1].trim()] = match[2].trim();
    }
  });

  return env;
}

function maskKey(key) {
  if (!key) return '[NOT SET]';
  if (key.length < 10) return `[LENGTH: ${key.length}]`;
  return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
}

async function testEndpoint(name, url, expectedFields) {
  try {
    const response = await fetch(url, {
      timeout: 10000,
    });

    if (!response.ok) {
      log.warn(`${name}: HTTP ${response.status}`);
      return false;
    }

    const data = await response.json();
    
    // Check if response has expected structure
    const hasFields = expectedFields.every(field => 
      field.split('.').reduce((obj, key) => obj?.[key], data) !== undefined
    );

    if (hasFields) {
      log.success(`${name}: ✓ Responds with expected data`);
      return true;
    } else {
      log.warn(`${name}: Response missing expected fields`);
      return false;
    }
  } catch (error) {
    log.error(`${name}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('\n' + colors.bright + colors.cyan);
  console.log('╔════════════════════════════════════════╗');
  console.log('║   🧪 API Verification Script         ║');
  console.log('║   Testing configured APIs              ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(colors.reset);

  // Load environment
  log.section('Loading Configuration');
  const env = await loadEnv();
  log.success('.env.local loaded');

  // Check keys
  log.section('Checking API Keys');
  
  const keys = [
    { name: 'GROQ_API_KEY', env: 'GROQ_API_KEY' },
    { name: 'FINNHUB_API_KEY', env: 'FINNHUB_API_KEY' },
    { name: 'FRED_API_KEY', env: 'FRED_API_KEY' },
    { name: 'EIA_API_KEY', env: 'EIA_API_KEY' },
    { name: 'ACLED_ACCESS_TOKEN', env: 'ACLED_ACCESS_TOKEN' },
    { name: 'ACLED_EMAIL', env: 'ACLED_EMAIL' },
  ];

  let keysConfigured = 0;
  keys.forEach(({ name, env: envKey }) => {
    const value = env[envKey];
    if (value && value !== 'YOUR_KEY_HERE' && value.length > 3) {
      log.success(`${name}: ${maskKey(value)}`);
      keysConfigured++;
    } else {
      log.warn(`${name}: NOT CONFIGURED`);
    }
  });

  console.log(`\n${colors.bright}Summary: ${keysConfigured}/${keys.length} keys configured${colors.reset}`);

  if (keysConfigured === 0) {
    log.error('\nNo API keys configured! Add them to .env.local first.');
    process.exit(1);
  }

  // Test endpoints
  log.section('Testing API Endpoints');
  
  const baseUrl = 'http://localhost:3000';
  let successCount = 0;

  const tests = [
    {
      name: 'Market Quotes (Finnhub)',
      url: `${baseUrl}/api/market/v1/list-market-quotes?symbols=AAPL,MSFT`,
      fields: ['quotes'],
      requiresKey: env.FINNHUB_API_KEY,
    },
    {
      name: 'Crypto Quotes',
      url: `${baseUrl}/api/market/v1/list-crypto-quotes?cryptos=BTC,ETH`,
      fields: ['quotes'],
      requiresKey: env.FINNHUB_API_KEY,
    },
    {
      name: 'Economic Macro Signals (FRED)',
      url: `${baseUrl}/api/economic/v1/get-macro-signals`,
      fields: ['signals'],
      requiresKey: env.FRED_API_KEY,
    },
    {
      name: 'ACLED Conflict Events',
      url: `${baseUrl}/api/conflict/v1/list-acled-events?country=US&limit=5`,
      fields: ['events'],
      requiresKey: env.ACLED_ACCESS_TOKEN,
    },
    {
      name: 'Energy (Oil prices - EIA)',
      url: `${baseUrl}/api/economic/v1/get-energy-prices`,
      fields: ['prices'],
      requiresKey: env.EIA_API_KEY,
    },
    {
      name: 'Intelligence Risk Scores',
      url: `${baseUrl}/api/intelligence/v1/get-risk-scores?region=global`,
      fields: ['ciiScores','strategicRisks'],
      requiresKey: env.GROQ_API_KEY,
    },
    {
      name: 'Country Intel Brief',
      url: `${baseUrl}/api/intelligence/v1/get-country-intel-brief?country_code=US`,
      fields: ['brief'],
      requiresKey: env.GROQ_API_KEY,
    },
    {
      name: 'Pizzint Status',
      url: `${baseUrl}/api/intelligence/v1/get-pizzint-status`,
      fields: ['pizzint','tensionPairs'],
      requiresKey: env.GROQ_API_KEY,
    },
  ];

  for (const test of tests) {
    if (!test.requiresKey) {
      log.warn(`${test.name}: API key not configured, skipping`);
      continue;
    }

    const result = await testEndpoint(test.name, test.url, test.fields);
    if (result) successCount++;
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  log.section('Verification Summary');
  console.log(`
${colors.bright}Results:${colors.reset}
  • API Keys Configured:  ${keysConfigured}/${keys.length}
  • Endpoints Tested:     ${tests.filter(t => t.requiresKey).length}
  • Endpoints Working:    ${successCount}/${tests.filter(t => t.requiresKey).length}
  • Success Rate:         ${Math.round((successCount / tests.filter(t => t.requiresKey).length) * 100)}%
  `);

  if (successCount === tests.filter(t => t.requiresKey).length) {
    log.success('\n🎉 All APIs working! Dashboard should be fully functional.\n');
    process.exit(0);
  } else if (successCount > 0) {
    log.warn('\n⚠️  Some APIs working, but not all. Check failed endpoints above.\n');
    process.exit(1);
  } else {
    log.error('\n❌ No APIs responding. Check:\n  1. Dev server running (npm run dev)\n  2. API keys valid\n  3. External services not down\n');
    process.exit(1);
  }
}

main().catch(console.error);
