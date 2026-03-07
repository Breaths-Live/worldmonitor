# 🎯 Action Plan: Enable Real-Time APIs on Local App

**Analysis Date:** March 4, 2026  
**Local App Status:** ✅ **RUNNING** at http://localhost:3000/  
**Configuration Status:** ⚠️ **INCOMPLETE** (No .env.local found)

---

## 📊 Current Diagnostic Results

### ✅ What's Working Now
- Local dev server is running
- Core UI and map are fully functional
- The app loads and is usable without any API keys
- Static data sources work (cached conflict data, basic market data)

### ❌ What's Missing (Requires API Keys)
- Real-time AI summaries (Groq/OpenRouter disabled)
- Market data updates (Finnhub disabled)
- Economic indicators (FRED, EIA disabled)
- Threat intelligence feeds (ACLED, OTX, AbuseIPDB disabled)
- Live military flight tracking (OpenSky relay disabled)
- Live vessel tracking (AIS relay disabled)

---

## 🚀 Quick Setup (5 minutes to 80% functionality)

### Step 1: Create Configuration File

```bash
cp .env.example .env.local
```

### Step 2: Add Free API Keys (Tier 1)

Edit `.env.local` and add these keys (get free):

#### **Groq LLM** (for AI summaries)
1. Go to: https://console.groq.com/
2. Sign up (free)
3. Create API key
4. Add to `.env.local`:
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
✨ This enables: Country briefs, article summaries, risk analysis

#### **Finnhub** (for market data)
1. Go to: https://finnhub.io/
2. Sign up (free)
3. Create API key
4. Add to `.env.local`:
```env
FINNHUB_API_KEY=fhxxxxxxxxxxxxxx
```
✨ This enables: Stock prices, crypto quotes, market timing

### Step 3: Restart Development Server

```bash
npm run dev
```

### Step 4: Verify Setup

```bash
node scripts/api-diagnostic.mjs
```

Expected output should show:
- ✓ AI Summaries (Groq)
- ✓ Market Data (Finnhub)

---

## 📈 Extended Setup (15 minutes for full intel)

### Add Tier 2: Economic Intelligence

#### **FRED** (Economic data)
1. Go to: https://fred.stlouisfed.org/docs/api/api_key.html
2. Register (free)
3. Add to `.env.local`:
```env
FRED_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### **EIA** (Energy data)
1. Go to: https://www.eia.gov/opendata/
2. Register (free)
3. Add to `.env.local`:
```env
EIA_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

✨ This enables: Oil prices, inflation, energy supply analysis

### Add Tier 3: Threat Intelligence

#### **ACLED** (Conflict events)
```env
ACLED_ACCESS_TOKEN=token|xxxxxxxxxxxxxxxx
```
✨ Enables: Real-time protest, riot, conflict events on map

#### **OTX** (Threat intel)
```env
OTX_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
✨ Enables: Malware signatures, phishing domains on cyber layer

---

## 🔄 Comparison: Local vs. Live App

### YouTube Live Detection
| Aspect | Local | Live |
|--------|-------|------|
| Status | ✅ Works | ✅ Works |
| Real-time? | Yes | Yes |
| Requires key? | No | No |
| API: `/api/youtube/live` | ✅ Works | ✅ Works |

> The 🎯 findings-icon works fine locally without keys

### AI-Powered Briefing (Country Briefs, Summaries)
| Aspect | Local | Live |
|--------|-------|------|
| Status | ❌ Disabled | ✅ Works |
| Real-time? | N/A | Yes |
| Requires key? | Yes (Groq/OpenRouter) | Yes (same) |
| API: `/api/intelligence/v1/get-country-intel-brief` | ❌ Needs Groq key | ✅ Works |

> **ACTION:** Add `GROQ_API_KEY` to `.env.local` to enable

### Military Flight Tracking
| Aspect | Local | Live |
|--------|-------|------|
| Status | ❌ Disabled | ✅ Works |
| Real-time? | Should be ~60sec | Yes, ~60sec |
| Requires key? | Yes (WS_RELAY_URL) | Yes (internal) |
| API: `/api/military/v1/list-military-flights` | ❌ No relay | ✅ Working |

> **ACTION:** Configure `WS_RELAY_URL` for real-time (advanced setup)

### Vessel Tracking (AIS)
| Aspect | Local | Live |
|--------|-------|------|
| Status | ❌ Disabled | ✅ Works |
| Real-time? | N/A | Yes, ~30sec |
| Requires key? | Yes (WS_RELAY_URL + AISSTREAM_API_KEY) | Yes (internal) |
| API: `/api/maritime/v1/get-vessel-snapshot` | ❌ No relay | ✅ Working |

> **ACTION:** Configure AIS relay (infrastructure setup required)

### Market Data
| Aspect | Local | Live |
|--------|-------|------|
| Status | ⚠️ Partial (fallback) | ✅ Complete |
| Real-time? | Delayed | Real-time |
| Requires key? | Finnhub key for full | Yes |
| APIs | Limited | Full suite |

> **ACTION:** Add `FINNHUB_API_KEY` to enable live market updates

---

## 🎬 Map Layer Status

### What Works Locally NOW (No Keys)
- ✅ Static map rendering
- ✅ Earthquake layer (cached)
- ✅ Infrastructure outages (cached)
- ✅ Keyboard-searchable keywords

### Needs Configuration
- ⚠️ **Conflicts** — Needs `ACLED_ACCESS_TOKEN`
- ⚠️ **Cyber threats** — Needs `OTX_API_KEY` + `ABUSEIPDB_API_KEY`
- ❌ **Military flights** — Needs `WS_RELAY_URL` + relay credentials
- ❌ **Vessels (AIS)** — Needs `AISSTREAM_API_KEY` + `WS_RELAY_URL`
- ⚠️ **Supply chain** — Works with cached data

---

## 🛠️ Why Real-Time Features Need External Keys

### Live Tracking (AIS/OpenSky)
- **Why disabled locally?** These require a WebSocket relay service (infrastructure cost)
- **Live app difference:** Deployed relay server proxies real-time data streams
- **Local workaround:** Could set up local relay, but requires significant DevOps work

### AI Summaries (Groq)
- **Why disabled locally?** LLM API calls must be authorized with credentials
- **Live app difference:** Uses same Groq keys but via Vercel Edge Functions
- **Local workaround:** Add your own Groq key to `.env.local` ← **EASY**

### Market Data (Finnhub)
- **Why disabled locally?** API key required by Finnhub for rate limiting
- **Live app difference:** Same key, but cached in Redis
- **Local workaround:** Add your own Finnhub key ← **EASY**

---

## 📋 Step-by-Step Getting Started

### Phase 1: Instant Setup (2 minutes)
```bash
cd d:\AI-KILLS\worldmonitor-aff
cp .env.example .env.local
# Edit .env.local if you have keys, or leave empty
npm run dev
# App now runs at http://localhost:3000/
```

### Phase 2: Add Free AI (5 minutes)
```bash
# 1. Visit https://console.groq.com/
# 2. Sign up (free, no credit card)
# 3. Create API key
# 4. Add to .env.local:
#    GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
# 5. Restart: npm run dev
```

### Phase 3: Add Free Market Data (5 minutes)
```bash
# 1. Visit https://finnhub.io/
# 2. Sign up (free)
# 3. Create API key
# 4. Add to .env.local:
#    FINNHUB_API_KEY=fhxxxxxxxxxxxxxx
# 5. Done! Market data now updates in real-time
```

### Phase 4: Verify (1 minute)
```bash
node scripts/api-diagnostic.mjs
# Should show:
#   ✓ AI Summaries (Groq)
#   ✓ Market Data (Finnhub)
```

**Total time: ~15 minutes for 80% functionality**

---

## 🌍 What You Get

### After Adding Groq + Finnhub Keys

| Feature | Status | Benefit |
|---------|--------|---------|
| 🤖 Country IntelBriefs | ✅ Enabled | "Show me the risk in France" → AI-generated brief |
| 📰 Article Summaries | ✅ Enabled | Hover news → Instant AI summary of key points |
| 📊 Market Prices | ✅ Enabled | Real-time stock/crypto prices with 1min update |
| 🎯 Risk Scoring | ✅ Enabled | AI-powered geopolitical risk calculations |
| 🗺️ Map Display | ✅ Full | All static layers + cached data |

### After Adding Economic Keys (FRED + EIA)

| Feature | Status |
|---------|--------|
| 💹 Economic Indicators | ✅ Real-time fed rates, inflation, unemployment |
| ⚡ Energy Markets | ✅ Oil prices, production, strategic reserves |
| 📉 Market Context | ✅ Supply/demand trends impact on markets |

---

## 📚 Useful Commands

```bash
# Check which APIs are configured
node scripts/api-diagnostic.mjs

# View environment file
cat .env.local

# Edit environment (VS Code)
code .env.local

# Check logs in dev server
npm run dev  # Watch console for errors

# Run E2E tests
npm run test:e2e

# Type check
npm run typecheck
```

---

## ⚠️ Gotchas & Troubleshooting

### "API returns empty data"
→ API key likely missing or invalid. Check with `node scripts/api-diagnostic.mjs`

### "Country briefs say 'No AI service available'"
→ `GROQ_API_KEY` not set. Add to `.env.local` and restart

### "Market prices are stale"
→ `FINNHUB_API_KEY` not set, or rate limit reached (free tier: 60 calls/min)

### "Real-time tracking shows 'No data'"
→ `WS_RELAY_URL` not configured. This requires infrastructure setup.

### ".env.local is being uploaded to Git"
→ Add `.env.local` to `.gitignore` to prevent leaking secrets

---

## 🎯 Next Actions

### Do This Right Now (5 min)
- [ ] Create `.env.local`: `cp .env.example .env.local`
- [ ] Bookmark Groq console: https://console.groq.com/
- [ ] Bookmark Finnhub: https://finnhub.io/

### Do This in Next 15 Minutes
- [ ] Sign up for Groq (free)
- [ ] Get Groq API key
- [ ] Add to `.env.local`
- [ ] Sign up for Finnhub (free)
- [ ] Get Finnhub API key
- [ ] Add to `.env.local`
- [ ] Run `npm run dev` (restart)
- [ ] Verify with `node scripts/api-diagnostic.mjs`

### Optional (Long Term)
- [ ] Set up Redis cache for cross-user deduping
- [ ] Add threat intel keys (ACLED, OTX)
- [ ] Configure local Ollama for offline AI
- [ ] Set up WebSocket relay for real-time tracking

---

## 📖 Documentation

| File | Purpose |
|------|---------|
| `API_COMPARISON_AND_SETUP.md` | Full feature comparison live vs. local |
| `.env.local.template` | Well-documented env template |
| `.env.example` | All available environment variables |
| `src/services/runtime-config.ts` | Which keys enable which features |
| `docs/API_KEY_DEPLOYMENT.md` | Deployment guide |
| `docs/RELAY_PARAMETERS.md` | WebSocket relay setup |

---

## 🏁 Result

After 15 minutes of setup, your local app will have:
- ✅ Real-time AI summaries
- ✅ Live market data
- ✅ Full map support
- ✅ Threat intelligence (with keys)
- ✅ Economic data (with keys)

**The only feature still requiring infrastructure: Live AIS/OpenSky relay tracking**

---

**Last Updated:** March 4, 2026 15:10 UTC  
**App Version:** 2.5.21

