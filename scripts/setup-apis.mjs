#!/usr/bin/env node

/**
 * World Monitor - Quick API Key Setup Script
 * 
 * Usage: node scripts/setup-apis.mjs
 * 
 * This script helps you:
 * 1. Create .env.local with API keys
 * 2. Validate API key formats
 * 3. Test connectivity to external APIs
 * 4. Show which features will be enabled
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => new Promise(resolve => rl.question(prompt, resolve));

const API_KEYS = [
  {
    name: 'GROQ_API_KEY',
    service: 'Groq (AI Summaries)',
    tier: 'ESSENTIAL',
    free_limit: '14,400 requests/day',
    url: 'https://console.groq.com/keys',
    enables: ['AI-powered threat classification', 'Headline summarization', 'Deduction panel'],
  },
  {
    name: 'FINNHUB_API_KEY',
    service: 'Finnhub (Market Data)',
    tier: 'ESSENTIAL',
    free_limit: '60 requests/min',
    url: 'https://finnhub.io/dashboard/api-keys',
    enables: ['Stock quotes', 'Market panel', 'Real-time pricing'],
  },
  {
    name: 'FRED_API_KEY',
    service: 'FRED (Economic Data)',
    tier: 'ESSENTIAL',
    free_limit: 'Unlimited',
    url: 'https://fredaccount.stlouisfed.org/login/',
    enables: ['Economic indicators', 'Macro signals', 'Oil & energy analytics'],
  },
  {
    name: 'EIA_API_KEY',
    service: 'EIA (Energy Data)',
    tier: 'ESSENTIAL',
    free_limit: 'Unlimited',
    url: 'https://www.eia.gov/opendata/register/',
    enables: ['WTI/Brent prices', 'US production data', 'Energy analytics'],
  },
  {
    name: 'ACLED_ACCESS_TOKEN',
    service: 'ACLED (Conflict Events)',
    tier: 'ESSENTIAL',
    free_limit: 'Free for researchers',
    url: 'https://acleddata.com/#/dashboard',
    enables: ['Protest tracking', 'Conflict events', 'Unrest monitoring'],
  },
  {
    name: 'ACLED_EMAIL',
    service: 'ACLED Email (Required)',
    tier: 'ESSENTIAL',
    free_limit: 'N/A',
    url: 'https://acleddata.com/#/dashboard',
    enables: ['ACLED authentication'],
  },
  {
    name: 'OPENROUTER_API_KEY',
    service: 'OpenRouter (AI Fallback)',
    tier: 'OPTIONAL',
    free_limit: '50 requests/day',
    url: 'https://openrouter.ai/',
    enables: ['AI fallback when Groq unavailable'],
  },
  {
    name: 'WINGBITS_API_KEY',
    service: 'Wingbits (Aircraft Intel)',
    tier: 'OPTIONAL',
    free_limit: 'Free tier available',
    url: 'https://www.wingbits.com/api',
    enables: ['Military flight enrichment', 'Aircraft identification'],
  },
  {
    name: 'WTO_API_KEY',
    service: 'WTO (Trade Policy)',
    tier: 'OPTIONAL',
    free_limit: 'Contact WTO',
    url: 'https://www.wto.org/english/res_e/recentres_e.htm',
    enables: ['Trade restrictions', 'Tariff data', 'Trade barriers'],
  },
];

async function showIntro() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   World Monitor - API Key Setup                           ║');
  console.log('║   Configure real-time data sources for your dashboard      ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('This script will help you set up API keys for:\n');
  const essential = API_KEYS.filter(k => k.tier === 'ESSENTIAL');
  const optional = API_KEYS.filter(k => k.tier === 'OPTIONAL');

  console.log('📌 ESSENTIAL (Recommended - ~1 hour to register all):');
  essential.forEach(k => {
    console.log(`   • ${k.service.padEnd(40)} (${k.free_limit})`);
  });

  console.log('\n🔧 OPTIONAL (Add later if needed):');
  optional.forEach(k => {
    console.log(`   • ${k.service.padEnd(40)} (${k.free_limit})`);
  });

  console.log('\n💡 You can add keys one at a time. The app works with partial setup.');
  console.log('   Which tier would you like to set up first?\n');
}

async function selectTier() {
  console.log('1) Essential (AI, Markets, Economics, Conflict)');
  console.log('2) All (Essential + Optional)');
  console.log('3) Manual (Choose which keys to add)');
  console.log('4) Skip setup (edit .env.local manually later)\n');

  const choice = await question('Enter choice (1-4): ');
  return choice.trim();
}

async function collectApiKeys(selectedKeys) {
  const keys = {};

  for (const apiKey of selectedKeys) {
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`\n📌 ${apiKey.service}`);
    console.log(`   Tier: ${apiKey.tier}`);
    console.log(`   Free limit: ${apiKey.free_limit}`);
    console.log(`\n   This key enables:`);
    apiKey.enables.forEach(e => console.log(`   ✓ ${e}`));
    console.log(`\n   Register here: ${apiKey.url}\n`);

    const value = await question(`Enter your ${apiKey.name} (or press Enter to skip): `);
    if (value.trim()) {
      keys[apiKey.name] = value.trim();
    }
  }

  return keys;
}

async function createEnvLocal(keys) {
  const envPath = path.join(process.cwd(), '.env.local');

  // Read template if it exists
  const templatePath = path.join(process.cwd(), '.env.example');
  let template = '';
  if (fs.existsSync(templatePath)) {
    template = fs.readFileSync(templatePath, 'utf-8');
  }

  // Replace or add keys to template
  let envContent = template;
  for (const [key, value] of Object.entries(keys)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  }

  fs.writeFileSync(envPath, envContent);
  console.log(`\n✅ Created: .env.local`);
  console.log(`📁 Path: ${envPath}\n`);
}

async function testApis(keys) {
  if (Object.keys(keys).length === 0) {
    console.log('\n⚠️  No API keys configured. Skipping tests.\n');
    return;
  }

  console.log('\n🧪 Testing API connectivity...\n');

  try {
    // Test GROQ
    if (keys.GROQ_API_KEY) {
      console.log('Testing GROQ API...');
      try {
        const response = await fetch('https://api.groq.com/openai/v1/models', {
          headers: { 'Authorization': `Bearer ${keys.GROQ_API_KEY}` }
        });
        if (response.ok) {
          console.log('  ✅ GROQ API: Connected\n');
        } else {
          console.log(`  ⚠️  GROQ API: Status ${response.status} (key may be invalid)\n`);
        }
      } catch (e) {
        console.log('  ⚠️  GROQ API: Connection failed (may be network issue)\n');
      }
    }

    // Test FINNHUB
    if (keys.FINNHUB_API_KEY) {
      console.log('Testing FINNHUB API...');
      try {
        const response = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=AAPL&token=${keys.FINNHUB_API_KEY}`
        );
        if (response.ok) {
          console.log('  ✅ FINNHUB API: Connected\n');
        } else {
          console.log(`  ⚠️  FINNHUB API: Status ${response.status} (key may be invalid)\n`);
        }
      } catch (e) {
        console.log('  ⚠️  FINNHUB API: Connection failed (may be network issue)\n');
      }
    }

    // Test FRED
    if (keys.FRED_API_KEY) {
      console.log('Testing FRED API...');
      try {
        const response = await fetch(
          `https://api.stlouisfed.org/fred/series?series_id=GDP&api_key=${keys.FRED_API_KEY}&file_type=json`
        );
        if (response.ok) {
          console.log('  ✅ FRED API: Connected\n');
        } else {
          console.log(`  ⚠️  FRED API: Status ${response.status} (key may be invalid)\n`);
        }
      } catch (e) {
        console.log('  ⚠️  FRED API: Connection failed (may be network issue)\n');
      }
    }
  } catch (e) {
    console.log(`❌ Test error: ${e.message}\n`);
  }
}

async function showNextSteps() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   Next Steps                                               ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('1️⃣  Restart the dev server:');
  console.log('   npm run dev\n');

  console.log('2️⃣  Open the app:');
  console.log('   http://localhost:3000/\n');

  console.log('3️⃣  Check which panels are now active:');
  console.log('   • Market Panel (stock prices)');
  console.log('   • Intelligence Panel (threat classification)');
  console.log('   • Conflict Panel (geopolitical events)');
  console.log('   • Economic Panel (macro signals)\n');

  console.log('4️⃣  Test an API endpoint directly:');
  console.log('   curl "http://localhost:3000/api/market/v1/list-market-quotes?symbols=AAPL,TSLA"\n');

  console.log('5️⃣  Add more keys later by editing .env.local directly.\n');

  console.log('📚 Full documentation: See API_INTEGRATION_STATUS.md\n');
}

async function main() {
  try {
    await showIntro();

    const tier = await selectTier();

    let selectedKeys = [];
    if (tier === '1') {
      selectedKeys = API_KEYS.filter(k => k.tier === 'ESSENTIAL');
    } else if (tier === '2') {
      selectedKeys = API_KEYS;
    } else if (tier === '3') {
      console.log('\nSelect keys to configure:');
      API_KEYS.forEach((k, i) => console.log(`  ${i + 1}) ${k.service}`));
      console.log('  Enter numbers separated by commas (e.g., 1,2,4):\n');
      const indices = (await question('Selection: ')).split(',').map(i => parseInt(i.trim()) - 1);
      selectedKeys = indices.map(i => API_KEYS[i]).filter(k => k);
    } else {
      console.log('\n⏭️  Skipping setup. You can edit .env.local manually later.\n');
      rl.close();
      return;
    }

    if (selectedKeys.length === 0) {
      console.log('\n❌ No keys selected.\n');
      rl.close();
      return;
    }

    const collectedKeys = await collectApiKeys(selectedKeys);

    if (Object.keys(collectedKeys).length > 0) {
      await createEnvLocal(collectedKeys);
      await testApis(collectedKeys);
    }

    await showNextSteps();

    rl.close();
  } catch (e) {
    console.error(`\n❌ Error: ${e.message}\n`);
    rl.close();
    process.exit(1);
  }
}

main();
