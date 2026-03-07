#!/usr/bin/env node
/**
 * World Monitor - Live API Connection Tester
 * Tests all 22 API services for live data connectivity
 * 
 * Usage: node scripts/test-live-connections.mjs
 */

import https from 'https';

const APIS = [
  // ✅ ACTIVE APIS
  {
    name: '📰 News Feed (RSS)',
    url: 'http://localhost:3000/api/news/v1/list-feed-digest',
    method: 'POST',
    body: { limit: 5 },
    expectedKeys: ['items', 'digest']
  },
  {
    name: '🔒 Market Quotes',
    url: 'http://localhost:3000/api/market/v1/list-market-quotes',
    method: 'POST',
    body: { symbols: ['AAPL', 'MSFT'] },
    expectedKeys: ['quotes']
  },
  {
    name: '🌍 Climate Anomalies',
    url: 'http://localhost:3000/api/climate/v1/list-climate-anomalies',
    method: 'POST',
    body: {},
    expectedKeys: ['anomalies']
  },
  {
    name: '🌋 Earthquakes',
    url: 'http://localhost:3000/api/seismology/v1/list-earthquakes',
    method: 'POST',
    body: { minMagnitude: 4.5 },
    expectedKeys: ['earthquakes']
  },
  {
    name: '🔥 Wildfires (NASA FIRMS)',
    url: 'http://localhost:3000/api/wildfire/v1/list-fires',
    method: 'POST',
    body: { days: 7 },
    expectedKeys: ['fires']
  },
  {
    name: '🎯 Cybersecurity Threats',
    url: 'http://localhost:3000/api/cyber/v1/list-threats',
    method: 'POST',
    body: {},
    expectedKeys: ['threats']
  },
  {
    name: '🛩️ Aviation Delays',
    url: 'http://localhost:3000/api/aviation/v1/list-airport-delays',
    method: 'POST',
    body: {},
    expectedKeys: ['airports']
  },
  {
    name: '✈️ Military Aircraft (OpenSky)',
    url: 'http://localhost:3000/api/military/v1/list-military-flights',
    method: 'POST',
    body: {},
    expectedKeys: ['flights']
  },
  {
    name: '🚢 Maritime Vessels (AIS)',
    url: 'http://localhost:3000/api/maritime/v1/list-vessels',
    method: 'POST',
    body: {},
    expectedKeys: ['vessels']
  },
  {
    name: '⚔️ Conflicts (ACLED)',
    url: 'http://localhost:3000/api/conflict/v1/list-conflicts',
    method: 'POST',
    body: { days: 7 },
    expectedKeys: ['events']
  },
  {
    name: '😠 Unrest & Protests',
    url: 'http://localhost:3000/api/unrest/v1/list-unrest',
    method: 'POST',
    body: {},
    expectedKeys: ['events']
  },
  {
    name: '📊 Economic Indicators',
    url: 'http://localhost:3000/api/economic/v1/list-indicators',
    method: 'POST',
    body: {},
    expectedKeys: ['indicators']
  },
  {
    name: '🏗️ Infrastructure Status',
    url: 'http://localhost:3000/api/infrastructure/v1/list-outages',
    method: 'POST',
    body: {},
    expectedKeys: ['outages']
  },
  {
    name: '🌐 Country Intelligence',
    url: 'http://localhost:3000/api/intelligence/v1/list-country-briefs',
    method: 'POST',
    body: { countries: ['US', 'RU', 'CH'] },
    expectedKeys: ['briefs']
  }
];

async function testAPI(config) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({
        name: config.name,
        status: '⏱️ TIMEOUT',
        time: 'N/A',
        data: 'Request exceeded 5 seconds'
      });
    }, 5000);

    const startTime = Date.now();
    const url = new URL(config.url);
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: config.method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const protocol = url.protocol === 'https:' ? https : require('http');
    
    const req = protocol.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        clearTimeout(timeout);
        const elapsed = Date.now() - startTime;
        
        try {
          const json = JSON.parse(data);
          const hasKeys = config.expectedKeys.every(k => k in json);
          const itemCount = json.items?.length || json.quotes?.length || json.earthquakes?.length || 0;
          
          resolve({
            name: config.name,
            status: res.statusCode === 200 && hasKeys ? '✅ LIVE' : '⚠️ PARTIAL',
            time: `${elapsed}ms`,
            items: itemCount,
            statusCode: res.statusCode
          });
        } catch (e) {
          resolve({
            name: config.name,
            status: '❌ ERROR',
            time: `${elapsed}ms`,
            error: e.message,
            statusCode: res.statusCode
          });
        }
      });
    });

    req.on('error', (err) => {
      clearTimeout(timeout);
      resolve({
        name: config.name,
        status: '❌ FAILED',
        time: 'N/A',
        error: err.message
      });
    });

    if (config.body) {
      req.write(JSON.stringify(config.body));
    }
    
    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 World Monitor - Live API Connection Test\n');
  console.log('=' .repeat(70));
  console.log('Testing API endpoint connectivity...\n');

  let passed = 0;
  let failed = 0;
  let partial = 0;

  for (const config of APIS) {
    const result = await testAPI(config);
    
    if (result.status.includes('✅')) passed++;
    if (result.status.includes('❌')) failed++;
    if (result.status.includes('⚠️')) partial++;

    const output = `${result.status} ${result.name.padEnd(35)} ${result.time.padEnd(10)}`;
    if (result.items) {
      console.log(`${output} [${result.items} items]`);
    } else if (result.error) {
      console.log(`${output} ${result.error}`);
    } else {
      console.log(output);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log(`\n📊 Results: ${passed} ✅ | ${partial} ⚠️ | ${failed} ❌\n`);

  if (failed === 0) {
    console.log('✨ All APIs are responding! Start npm run dev to see live data.\n');
  } else {
    console.log(`⚠️  ${failed} APIs are not responding. Check:\n`);
    console.log('  1. Is npm run dev running?');
    console.log('  2. Are UPSTASH_REDIS_* and WS_RELAY_URL configured?');
    console.log('  3. Check docs/API_LIVE_CONNECTIONS.md for setup steps\n');
  }
}

runTests().catch(console.error);
