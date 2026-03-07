#!/usr/bin/env node

/**
 * API Diagnostic Checker
 * 
 * Run from terminal: node scripts/api-diagnostic.mjs
 * 
 * Tests which APIs are accessible locally and remotely
 * Identifies missing configuration for real-time features
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const envLocalPath = path.join(rootDir, '.env.local');
const envExamplePath = path.join(rootDir, '.env.example');

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  bold: '\x1b[1m',
};

function log(color, text) {
  console.log(`${color}${text}${colors.reset}`);
}

function parseEnv(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const env = {};
    content.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        env[key] = value;
      }
    });
    return env;
  } catch {
    return {};
  }
}

async function testHttpEndpoint(url, method = 'GET', timeout = 5000) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, { 
      method,
      signal: controller.signal,
      headers: { 'User-Agent': 'WorldMonitor-Diagnostic/1.0' }
    });
    
    clearTimeout(timeoutId);
    return {
      reachable: response.ok || response.status === 401,
      status: response.status,
      type: 'http'
    };
  } catch (err) {
    return {
      reachable: false,
      error: err.message,
      type: 'http'
    };
  }
}

async function runDiagnostics() {
  log(colors.bold + colors.blue, '\n╔════════════════════════════════════════════════════════════╗');
  log(colors.bold + colors.blue, '║  World Monitor: API Diagnostic Checker                       ║');
  log(colors.bold + colors.blue, '║  Generated: ' + new Date().toLocaleString() + '                    ║');
  log(colors.bold + colors.blue, '╚════════════════════════════════════════════════════════════╝\n');

  // Check environment files
  log(colors.yellow, '📋 Environment Files:');
  const hasEnvLocal = fs.existsSync(envLocalPath);
  const hasEnvExample = fs.existsSync(envExamplePath);
  
  console.log(`   ${hasEnvLocal ? colors.green + '✓' : colors.red + '✗'} .env.local ${hasEnvLocal ? '(FOUND)' : '(missing)'}`);
  console.log(`   ${hasEnvExample ? colors.green + '✓' : colors.red + '✗'} .env.example ${hasEnvExample ? '(OK)' : '(missing)'}`);
  
  if (!hasEnvLocal) {
    log(colors.yellow, '\n   ⚠️  No .env.local found. Run: cp .env.example .env.local');
  }

  const env = parseEnv(envLocalPath);
  const example = parseEnv(envExamplePath);

  // Categorize API keys
  const categories = {
    ai: ['GROQ_API_KEY', 'OPENROUTER_API_KEY', 'OLLAMA_API_URL', 'OLLAMA_MODEL'],
    market: ['FINNHUB_API_KEY'],
    economic: ['FRED_API_KEY', 'EIA_API_KEY'],
    threat: ['ACLED_ACCESS_TOKEN', 'OTX_API_KEY', 'ABUSEIPDB_API_KEY', 'URLHAUS_AUTH_KEY'],
    aviation: ['WINGBITS_API_KEY', 'ICAO_API_KEY', 'AVIATIONSTACK_API'],
    cache: ['UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
    relay: ['WS_RELAY_URL', 'AISSTREAM_API_KEY', 'VITE_OPENSKY_RELAY_URL', 'OPENSKY_CLIENT_ID', 'OPENSKY_CLIENT_SECRET'],
  };

  log(colors.bold + colors.blue, '\n📊 API Key Configuration Status:\n');

  for (const [category, keys] of Object.entries(categories)) {
    const configured = keys.filter(k => env[k] && env[k].length > 0);
    const total = keys.length;
    const status = configured.length === total ? colors.green + '✓ COMPLETE' : 
                   configured.length > 0 ? colors.yellow + '⚠ PARTIAL' : 
                   colors.red + '✗ MISSING';
    
    console.log(`${status.padEnd(20)} ${category.toUpperCase().padEnd(15)} (${configured.length}/${total})`);
    
    keys.forEach(key => {
      const hasKey = env[key] && env[key].length > 0;
      const icon = hasKey ? colors.green + '✓' : colors.gray + '○';
      const value = hasKey ? '***' + env[key].slice(-8) : '(not set)';
      console.log(`   ${icon} ${key.padEnd(30)} ${value}`);
    });
    console.log();
  }

  // Feature availability estimation
  log(colors.bold + colors.blue, '🎯 Feature Availability Estimate:\n');

  const estimates = {
    'Live Tracking (AIS/OpenSky)': env['WS_RELAY_URL'] && env['AISSTREAM_API_KEY'],
    'AI Summaries': env['GROQ_API_KEY'] || env['OPENROUTER_API_KEY'] || env['OLLAMA_API_URL'],
    'Market Data': env['FINNHUB_API_KEY'],
    'Economic Intelligence': env['FRED_API_KEY'] && env['EIA_API_KEY'],
    'Threat Intelligence': env['ACLED_ACCESS_TOKEN'] && env['OTX_API_KEY'],
    'Aviation Enrichment': env['WINGBITS_API_KEY'],
    'Cross-user Cache': env['UPSTASH_REDIS_REST_URL'] && env['UPSTASH_REDIS_REST_TOKEN'],
  };

  for (const [feature, enabled] of Object.entries(estimates)) {
    const icon = enabled ? colors.green + '✓' : colors.red + '✗';
    console.log(`${icon} ${feature}`);
  }

  // Connectivity tests
  log(colors.bold + colors.blue, '\n🌐 Connectivity Tests:\n');

  const endpoints = [
    { name: 'Local Dev Server', url: 'http://localhost:3000/', critical: true },
    { name: 'Live App', url: 'https://www.worldmonitor.app/', critical: false },
    { name: 'Bootstrap API', url: 'http://localhost:3000/api/bootstrap', critical: true },
  ];

  for (const endpoint of endpoints) {
    process.stdout.write(`   Testing ${endpoint.name}... `);
    const result = await testHttpEndpoint(endpoint.url, 'HEAD');
    if (result.reachable) {
      log(colors.green, `✓ (HTTP ${result.status})`);
    } else {
      const critical = endpoint.critical ? colors.red : colors.yellow;
      log(critical, `✗ (${result.error || 'unreachable'})`);
    }
  }

  // Recommendations
  log(colors.bold + colors.blue, '\n💡 Recommendations:\n');

  const missingTier1 = ['GROQ_API_KEY', 'FINNHUB_API_KEY'].filter(k => !env[k] || !env[k].length);
  const missingTier2 = ['FRED_API_KEY', 'EIA_API_KEY'].filter(k => !env[k] || !env[k].length);

  if (missingTier1.length > 0) {
    log(colors.yellow, `1️⃣  Add Tier 1 keys for best experience:`);
    if (!env['GROQ_API_KEY']) console.log(`   • GROQ_API_KEY → https://console.groq.com/ (14,400 req/day free)`);
    if (!env['FINNHUB_API_KEY']) console.log(`   • FINNHUB_API_KEY → https://finnhub.io/ (60 calls/min free)`);
  }

  if (missingTier2.length > 0) {
    log(colors.yellow, `\n2️⃣  Consider adding Tier 2 (economic data):`);
    console.log(`   • FRED_API_KEY → https://fred.stlouisfed.org/docs/api/api_key.html`);
    console.log(`   • EIA_API_KEY → https://www.eia.gov/opendata/`);
  }

  if (!env['OLLAMA_API_URL']) {
    log(colors.yellow, `\n3️⃣  For offline AI (optional):`);
    console.log(`   • Install Ollama: https://ollama.ai/`);
    console.log(`   • Run: ollama pull mistral`);
    console.log(`   • Set: OLLAMA_API_URL=http://localhost:11434`);
  }

  log(colors.bold + colors.blue, '\n📖 Documentation:\n');
  console.log(`   • Full guide: API_COMPARISON_AND_SETUP.md`);
  console.log(`   • Environment template: .env.local.template`);
  console.log(`   • Feature details: src/services/desktop-readiness.ts`);

  log(colors.bold + colors.blue, '\n✅ Quick Start:\n');
  console.log(`   1. cp .env.example .env.local`);
  console.log(`   2. Edit .env.local and add at least GROQ_API_KEY + FINNHUB_API_KEY`);
  console.log(`   3. npm run dev`);
  console.log(`   4. Open Settings → Diagnostics to verify\n`);
}

// Run diagnostics
runDiagnostics().catch(err => {
  log(colors.red, `\n❌ Error: ${err.message}\n`);
  process.exit(1);
});
