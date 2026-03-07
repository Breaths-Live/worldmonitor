# World Monitor: Local vs. Live API Comparison & Setup Guide

**Generated:** March 4, 2026  
**App Version:** 2.5.21  
**Local URL:** http://localhost:3000/  
**Live URL:** https://www.worldmonitor.app/

---

## Executive Summary

The local clone (`http://localhost:3000/`) is **functional** but **incomplete**. Real-time data features require proper configuration and external API keys.

### Current Status

- ✅ **Core UI & Map Rendering** — Fully functional locally
- ✅ **Static Data Layers** — Conflicts, outages, cyber threats load from cache
- ⚠️ **Live Tracking (AIS/OpenSky)** — Works on production, disabled locally without config
- ⚠️ **Real-time News Feeds (YouTube)** — Works on production, may need setup
- ❌ **AI Summaries (Groq/OpenRouter)** — Requires API keys configured
- ❌ **Market Data (Finnhub, EIA, FRED)** — Requires API keys configured
- ❌ **Advanced Intel (ACLED, OTX, AbuseIPDB)** — Requires API keys configured

---

## 🎯 Real-Time Features Comparison

### 1. **Live Tracking (Military Flights & Vessels)**

#### Live App (https://www.worldmonitor.app/)
- ✅ **AIS Relay** (Vessel tracking, real-time maritime data)
  - Endpoint: `/api/maritime/v1/get-vessel-snapshot`
  - Data source: AIS stream via `WS_RELAY_URL`
  - Status: **Real-time updates every ~30 seconds**

- ✅ **OpenSky Relay** (Military aircraft, commercial aviation)
  - Endpoint: `/api/military/v1/list-military-flights`
  - Data source: OpenSky API via `WS_RELAY_URL`
  - Status: **Real-time updates every ~60 seconds**

#### Local App (http://localhost:3000/)
- ❌ **AIS Relay** — Unavailable without `WS_RELAY_URL` + `AISSTREAM_API_KEY`
- ❌ **OpenSky Relay** — Unavailable without `VITE_OPENSKY_RELAY_URL` + `OPENSKY_CLIENT_ID/SECRET`
- ⚠️ **Fallback:** Browser loads static/cached data only

---

### 2. **Live News Feeds & Video Search**

#### Live App
- ✅ **YouTube Live Detection** (Real-time channel status)
  - Endpoint: `/api/youtube/live`
  - Handler: `api/youtube/live.js`
  - Status: **Works via embedded YouTubei.js library**
  - Updates: **On-demand (when user opens LiveNews panel)**

- ✅ **RSS Feed Aggregation**
  - Endpoint: `/api/rss-proxy`
  - Handler: `api/rss-proxy.js`
  - Sources: TelegraphAPI, Reuters, BBC, Reuters, etc.
  - Status: **Real-time updates via Vercel Edge caching**

#### Local App
- ✅ **YouTube Live Detection** — Should work (YouTubei.js included)
- ✅ **RSS Feed Aggregation** — Should work (locally available)
- Status: **Functional without API keys**

---

### 3. **AI-Powered Intelligence & Summaries**

#### Live App
- ✅ **Groq LLM Summarization**
  - Endpoint: `/api/news/v1/summarize-article`
  - Key: `GROQ_API_KEY`
  - Rate: 14,400 requests/day (free tier)

- ✅ **OpenRouter Fallback**
  - Key: `OPENROUTER_API_KEY`
  - Rate: 50+ requests/day (free tier)

- ✅ **Ollama Local LLM**
  - Endpoint: `OLLAMA_API_URL` (local Docker/binary)
  - No rate limits, runs locally

#### Local App
- ❌ **Groq** — Unavailable without `GROQ_API_KEY`
- ❌ **OpenRouter** — Unavailable without `OPENROUTER_API_KEY`
- ❌ **Ollama** — Works if `OLLAMA_API_URL` configured (requires local Ollama instance)
- ⚠️ **Fallback:** Browser-side summarization using WebAssembly transformers

**Why it matters:** The 🎯 findings-icon (risk score briefings) require AI integration.

---

### 4. **Economic & Market Data**

#### Live App
- ✅ **FRED (Federal Reserve Data)**
  - Endpoint: `/api/economic/v1/...` (via gRPC)
  - Key: `FRED_API_KEY`
  - Data: Inflation, unemployment, recession indicators

- ✅ **EIA (Energy Info Admin)**
  - Endpoint: `/api/energy/v1/...` (via gRPC)
  - Key: `EIA_API_KEY`
  - Data: Oil prices, production, inventory

- ✅ **Finnhub (Stock Quotes)**
  - Endpoint: `/api/market/v1/list-crypto-quotes`
  - Key: `FINNHUB_API_KEY`
  - Data: Real-time equity & commodity prices

#### Local App
- ❌ **FRED** — Unavailable without `FRED_API_KEY`
- ❌ **EIA** — Unavailable without `EIA_API_KEY`
- ❌ **Finnhub** — Unavailable without `FINNHUB_API_KEY`
- ✅ **Crypto Markets** — Fallback to free sources (CoinGecko API)

---

### 5. **Threat Intelligence & Conflict Data**

#### Live App
- ✅ **ACLED Conflict Events**
  - Endpoint: `/api/conflict/v1/list-acled-events`
  - Key: `ACLED_ACCESS_TOKEN`
  - Data: Protests, riots, conflicts (real-time)
  - Status: **Cached via Redis, updated daily**

- ✅ **OTX (AlienVault Threat Intel)**
  - Endpoint: `/api/cyber/v1/list-cyber-threats`
  - Key: `OTX_API_KEY`
  - Data: IPs, domains, malware signatures

- ✅ **AbuseIPDB**
  - Endpoint: `/api/cyber/v1/list-cyber-threats`
  - Key: `ABUSEIPDB_API_KEY`
  - Data: Malicious IP reputation

- ✅ **AbuseChURL Threat List**
  - Endpoint: `/api/cyber/v1/list-cyber-threats`
  - Key: `URLHAUS_AUTH_KEY`
  - Data: Malicious URLs

#### Local App
- ❌ **ACLED** — Unavailable without `ACLED_ACCESS_TOKEN`
- ❌ **OTX** — Unavailable without `OTX_API_KEY`
- ❌ **AbuseIPDB** — Unavailable without `ABUSEIPDB_API_KEY`
- ❌ **AbuseChURL** — Unavailable without `URLHAUS_AUTH_KEY`
- ⚠️ **Fallback:** Static/cached conflict data only

---

### 6. **Aviation & Military Intelligence**

#### Live App
- ✅ **Wingbits Aircraft Enrichment**
  - Endpoint: `/api/military/v1/get-aircraft-details`
  - Key: `WINGBITS_API_KEY`
  - Data: Military aircraft type, operator, history

- ✅ **ICAO NOTAM Service**
  - Endpoint: `/api/military/v1/...`
  - Key: `ICAO_API_KEY`
  - Data: Airspace restrictions, NOTAMs

- ✅ **AviationStack**
  - Endpoint: `/api/military/v1/...`
  - Key: `AVIATIONSTACK_API`
  - Data: Commercial flight tracking

#### Local App
- ❌ **Wingbits** — Unavailable without `WINGBITS_API_KEY`
- ❌ **ICAO NOTAM** — Unavailable without `ICAO_API_KEY`
- ❌ **AviationStack** — Unavailable without `AVIATIONSTACK_API`
- ✅ **OpenSky Fallback** — Works with local config

---

## 🔧 Setup Guide: Enable Real-Time APIs Locally

### Step 1: Create `.env.local` Configuration

Copy from `.env.example`:

```bash
cp .env.example .env.local
```

### Step 2: Add Required API Keys

Edit `.env.local` and fill in the keys you have:

#### **Tier 1 — Core Real-Time Features (Recommended)**

```env
# AI Summarization (Free tier available)
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
# https://console.groq.com/

OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxxxxxx
# https://openrouter.ai/

# Market Data (Free tier available)
FINNHUB_API_KEY=fhxxxxxxxxxxxxxx
# https://finnhub.io/
```

#### **Tier 2 — Economic Intel**

```env
EIA_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# https://www.eia.gov/opendata/

FRED_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# https://fred.stlouisfed.org/docs/api/api_key.html
```

#### **Tier 3 — Advanced Threat Intel**

```env
ACLED_ACCESS_TOKEN=token|xxxxxxxxxxxxxxxx
# https://acleddata.com/

OTX_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# https://otx.alienvault.com/

ABUSEIPDB_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# https://www.abuseipdb.com/

URLHAUS_AUTH_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# https://urlhaus.abuse.ch/

WINGBITS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# https://www.wingbits.com/
```

#### **Tier 4 — Live Relay (Production Setup Only)**

```env
# These require infrastructure (WebSocket relay service)
WS_RELAY_URL=wss://relay.yourdomain.com  # Needs custom setup
AISSTREAM_API_KEY=xxxxx
VITE_OPENSKY_RELAY_URL=wss://relay.yourdomain.com/opensky
OPENSKY_CLIENT_ID=xxxxx
OPENSKY_CLIENT_SECRET=xxxxx
```

#### **Tier 5 — Local AI (Optional)**

```env
# For offline AI summaries without Groq/OpenRouter
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama2  # or mistral, neural-chat, etc.
```

### Step 3: Restart Dev Server

```bash
npm run dev
```

The app will detect and enable available features automatically.

### Step 4: Verify Configuration

1. Open Settings panel (`⚙️` icon)
2. Go to **Diagnostics** tab
3. Check "Feature Availability" — Available vs. Total keys
4. Look for warnings about missing keys

---

## 📊 What's Working Right Now (Without Keys)

| Feature | Status | Location in UI | Notes |
|---------|--------|----------------|-------|
| **Map Rendering** | ✅ | Main viewport | All layers render |
| **Live News Panel** | ✅ | Right sidebar | YouTube channel detection works |
| **Monitor (Keyword Search)** | ✅ | Right sidebar | Searches loaded news corpus |
| **Market Panel** | ⚠️ | Bottom left | Crypto prices via CoinGecko (fallback) |
| **Strategic Risk** | ✅ | Charts area | Local aggregate scoring |
| **Conflict Layer** | ✅ | Map | Cached ACLED data only |
| **AIS/Vessels** | ❌ | Map | Disabled without relay config |
| **Military Flights** | ❌ | Map | Disabled without relay config |
| **Threat Intel** | ⚠️ | Cyber layer | Limited to static sources |
| **AI Summaries** | ⚠️ | News articles | Browser-side fallback (slow) |
| **Country Briefs** | ❌ | Country popup | Requires Groq or OpenRouter key |

---

## 🚀 Optimization Recommendations

### For Local Development

1. **Install Ollama for Free AI**
   ```bash
   # Download from https://ollama.ai/
   # Then configure in settings
   OLLAMA_API_URL=http://localhost:11434
   OLLAMA_MODEL=mistral  # Recommended for speed/accuracy
   ```

2. **Set Redis Cache (Upstash Free Tier)**
   ```env
   UPSTASH_REDIS_REST_URL=https://us1-xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=xxx
   ```

3. **Use Free/Generous Tiers**
   - Groq: 14,400 req/day (free)
   - Finnhub: 60 calls/min (free)
   - Fred: Unlimited (free)
   - EIA: Unlimited (free)

### For Production Deployment

1. **Set up WebSocket Relay** (for AIS/OpenSky)
   - Required for: Real-time military flight tracking, vessel tracking
   - Technology: Node.js, WebSocket, could use AWS AppSync or similar

2. **Enable ACLED Feed**
   - Provides conflict event real-time data
   - Requires institutional access (paid)

3. **Use Commercial Threat Intel**
   - OTX, AbuseIPDB for cyber threat layers
   - Integrate with security team workflows

---

## 🔐 Security Notes

1. **Never commit `.env.local`** — Add to `.gitignore`
2. **For Desktop App** — Keys stored in Tauri secure storage
3. **For Web App** — Keys sent only to Vercel Edge Functions
4. **Rate Limiting** — Implemented via `@upstash/ratelimit`

---

## 📝 Troubleshooting

### "API returns 403 Forbidden"
- Likely bot/crawler detection
- Check middleware.ts for user-agent rules
- Ensure proper headers are sent

### "Real-time tracking shows 'No data'"
- Verify `WS_RELAY_URL` and relay credentials
- Check browser console for fetch errors
- Relay service may be down or credentials invalid

### "Country briefs show 'No AI service available'"
- No Groq/OpenRouter key configured
- Install Ollama for local fallback
- Browser-side summarization (slower, uses ~100MB WASM)

### "Market prices stale"
- Redis cache may not be synced
- Finnhub API rate limit reached
- Check `data-freshness.ts` for caching logic

---

## 📚 Additional Resources

- **Environment Setup:** `.env.example`
- **API Docs:** `docs/DOCUMENTATION.md`, `docs/API_KEY_DEPLOYMENT.md`
- **Desktop Config:** `docs/DESKTOP_CONFIGURATION.md`
- **Relay Setup:** `docs/RELAY_PARAMETERS.md`
- **Feature Availability:** `src/services/desktop-readiness.ts`
- **Runtime Config:** `src/services/runtime-config.ts`

---

## ✅ Checklist: Get Full Real-Time Locally

- [ ] Copy `.env.example` → `.env.local`
- [ ] Add Groq or OpenRouter API key (for AI)
- [ ] Add Finnhub API key (for market data)
- [ ] Add ACLED token (for conflict events)
- [ ] Optional: Install Ollama for offline AI
- [ ] Optional: Set up Redis cache
- [ ] Optional: Configure AIS/OpenSky relay (advanced)
- [ ] Restart `npm run dev`
- [ ] Verify in Settings → Diagnostics

---

**Last Updated:** March 4, 2026  
**App Version:** 2.5.21

