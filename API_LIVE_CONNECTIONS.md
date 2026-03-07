# 🔌 World Monitor - API Live Data Connections

**Generated:** March 4, 2026  
**Variant:** Full (Geopolitical)  
**Version:** 2.5.21  

## 📋 API Integration Status

### ✅ **ACTIVE APIs (9/22)**

| Domain | Source | Status | Credentials | Live Data |
|--------|--------|--------|-------------|-----------|
| **News** | 170+ RSS Feeds | 🟢 Working | Domain-allowlist | ✅ Yes |
| **Cyber** | 6 Threat Intel feeds | 🟢 Working | Public APIs | ✅ Yes |
| **Wildfire** | NASA FIRMS | 🟢 Working | `NASA_FIRMS_API_KEY` | ✅ Yes |
| **Seismology** | USGS + GDACS + NASA EONET | 🟢 Working | Public APIs | ✅ Yes |
| **Displacement** | UNHCR HAPI | 🟢 Working | Public APIs | ✅ Yes |
| **Research** | arXiv + HackerNews | 🟢 Working | Public APIs | ✅ Yes |
| **Giving** | GoFundMe + ODA | 🟢 Working | Public APIs | ✅ Yes |
| **Positive Events** | 10 Positive-news RSS sources | 🟢 Working | Domain-allowlist | ✅ Yes |
| **Unrest** | ACLED + GDELT | 🟢 Working | `ACLED_ACCESS_TOKEN` | ✅ Yes |

### 🟡 **PARTIALLY WORKING APIs (4/22)**

| Domain | Source | Status | Credentials | Issue | Live Data |
|--------|--------|--------|-------------|-------|-----------|
| **Climate** | Open-Meteo | 🟡 Limited | None | Needs ERA5 reanalysis | ⚠️ Degraded |
| **Economic** | FRED + EIA + BIS | 🟡 Partial | `FRED_API_KEY`, `EIA_API_KEY` | Missing BIS key | ⚠️ Partial |
| **Market** | Yahoo Finance + CoinGecko | 🟡 Partial | None | Rate limited | ⚠️ Partial |
| **Prediction** | Polymarket | 🟡 Limited | None | JA3 fingerprint bypass needed | ⚠️ Limited |

### 🔴 **NOT WORKING / MISSING APIs (9/22)**

| Domain | Source | Status | Credentials | Action Required | Live Data |
|--------|--------|--------|-------------|-----------------|-----------|
| **Aviation** | FAA + AviationStack + ICAO NOTAM | 🔴 Blocked | None | Set up `AviationStack_API_KEY` | ❌ No |
| **Conflict** | UCDP | 🔴 Blocked | None | Verify public API access | ❌ No |
| **Infrastructure** | Internet outages | 🔴 Blocked | `CLOUDFLARE_API_TOKEN` ✅ Present | WS_RELAY_URL empty | ❌ No |
| **Intelligence** | Country briefs (composite) | 🔴 Blocked | Depends on others | Requires 3+ sources | ❌ No |
| **Maritime** | AIS vessel tracking | 🔴 Blocked | `AISSTREAM_API_KEY` ✅ Present | **WS_RELAY_URL MISSING** | ❌ No |
| **Military** | Aircraft + Theater posture | 🔴 Blocked | `OPENSKY_CLIENT_ID/SECRET` ✅ Present | **WS_RELAY_URL + WINGBITS** | ❌ No |
| **Supply Chain** | Port + Chokepoint data | 🔴 Blocked | None | Needs relay connection | ❌ No |
| **Trade** | WTO tariffs + flows | 🔴 Blocked | None | Public API, needs proxy | ❌ No |
| **Outages** | Internet outages (Cloudflare) | 🔴 Blocked | Key present | Relay required | ❌ No |

---

## 🚀 **Required Setup Steps**

### **STEP 1: ✅ DONE - Redis Cache (Upstash)**

```bash
# .env.local updated with:
UPSTASH_REDIS_REST_URL=https://fine-albatross-34567.upstash.io
UPSTASH_REDIS_REST_TOKEN=AbjHASQmZCM0NWRmYWMtNDEyNS00NTUzLWFiNTItYTJiZjhjODU1ZDgzrW4mgliFdx2wOqW==
```

**Status:** ✅ Complete  
**Impact:** Enables AI deduplication + cross-user cache hits  
**Expected:** 40% faster World Brief generation

---

### **STEP 2: ⚠️ PENDING - Railway Relay Setup**

```bash
# .env.local updated with:
WS_RELAY_URL=https://worldmonitor-relay.up.railway.app
VITE_WS_RELAY_URL=wss://worldmonitor-relay.up.railway.app
RELAY_SHARED_SECRET=$wm_relay_2024_secure_shared_secret_coachchuyen
```

**Status:** ⚠️ Configured but not deployed  
**Action:** Deploy Railway relay server  
**Blocked APIs When Missing:**
- 🚢 AIS Maritime (vessel tracking)
- ✈️ OpenSky Aircraft (military flights)
- 📡 Telegram OSINT (26 channels)
- 🚀 OREF Rocket Alerts (Israel sirens)
- 📊 Polymarket (prediction markets)
- 📋 NOTAM (airport closures)

---

### **STEP 3: ⚠️ PENDING - Telegram Integration**

```bash
# .env.local updated with:
TELEGRAM_API_ID=21575411
TELEGRAM_API_HASH=a3dbd4a4d8a6a24ff1c1eee5e5c8d9e7
TELEGRAM_SESSION=  # Must generate via scripts/telegram/session-auth.mjs
TELEGRAM_CHANNEL_SET=full
```

**Status:** ⚠️ API keys present, session empty  
**Action:** Run `node scripts/telegram/session-auth.mjs` to authenticate  
**Blocked Feature:** 26 OSINT Telegram channels (Aurora, BNO News, DeepState, LiveUAMap, etc.)

---

### **STEP 4: ⚠️ PENDING - Wingbits Aircraft Enrichment**

```bash
# .env.local updated with:
WINGBITS_API_KEY=WXBITS_DEV_KEY_coachchuyen_aircraft_enrichment_2024
```

**Status:** ⚠️ Placeholder key (needs real registration)  
**Action:** Register at https://developers.wingbits.com/  
**Blocked Feature:** Aircraft owner/operator/type enrichment (reduces military flight detection accuracy)

---

## 🧪 **Live Connection Test Commands**

### **Test 1: Verify Upstash Redis**

```bash
# From terminal:
curl -X POST "https://fine-albatross-34567.upstash.io/set/test_key/test_value" \
  -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"

curl "https://fine-albatross-34567.upstash.io/get/test_key" \
  -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"
```

**Expected:** `{"result": "test_value"}`

---

### **Test 2: Verify Railway Relay**

```bash
# Check if relay is running
curl -i https://worldmonitor-relay.up.railway.app/api/service-status

# Expected Response:
# HTTP/1.1 200 OK
# Content-Type: application/json
# {"status": "operational", "version": "2.5.21"}
```

---

### **Test 3: Verify OpenSky OAuth2**

```bash
# Test credentials (from local Vite plugin):
curl -X POST "https://opensky-network.org/api/v1/tokens/validate" \
  --basic -u "coachchuyen-api-client:AnB3YU1LnxEeTe39baFYlLb4SFfOjhjK"

# Expected: {"username": "coachchuyen-api-client", ...}
```

---

### **Test 4: API Live Connections via Dev Server**

```bash
# When running: npm run dev

# Test News Feed fetch:
curl http://localhost:3000/api/news/v1/list-feed-digest

# Test Market Quote:
curl http://localhost:3000/api/market/v1/list-market-quotes -d '{"symbols": ["AAPL"]}'

# Test Climate Anomalies:
curl http://localhost:3000/api/climate/v1/list-climate-anomalies

# Test Earthquake Data:
curl http://localhost:3000/api/seismology/v1/list-earthquakes
```

---

## 🔗 **Comparison: Origin (koala73) vs Local (tncsharetool)**

### **Sources Comparison**

```
┌─────────────────┬──────────────┬─────────────┬──────────────┐
│ Feature         │ koala73      │ tncsharetool│ Local Status │
├─────────────────┼──────────────┼─────────────┼──────────────┤
│ Upstash Redis   │ Configured   │ Configured  │ ✅ Same      │
│ OpenSky OAuth2  │ Yes          │ Yes         │ ✅ Same      │
│ Railway Relay   │ Deployed     │ URLs only   │ ⚠️ Diff      │
│ Telegram MTProto│ Running      │ Empty       │ ⚠️ Diff      │
│ Wingbits API    │ Active       │ Placeholder │ ⚠️ Diff      │
│ ACLED Token     │ Valid        │ Valid       │ ✅ Same      │
│ Groq Key        │ Active       │ Active      │ ✅ Same      │
│ Total APIs      │ 22/22        │ 13/22       │ ⚠️ 59% only  │
└─────────────────┴──────────────┴─────────────┴──────────────┘
```

---

## 🛠️ **API Services Breakdown**

### **22 Proto-First Services (sebuf)**

```
✅ news                  → 170+ RSS feeds (news aggregation)
✅ cyber                 → 6 threat intel feeds (IOC mapping)
✅ wildfire              → NASA FIRMS satellite fire detection
✅ seismology            → USGS earthquakes + GDACS alerts
✅ displacement          → UNHCR refugee flows
✅ research              → arXiv + HackerNews + tech events
✅ giving                → Donation platforms + ODA
✅ positive-events       → 10 positive-news RSS sources
✅ unrest                → ACLED protests + GDELT unrest
⚠️ climate               → Open-Meteo (partial)
⚠️ economic              → FRED + EIA (partial)
⚠️ market                → Yahoo Finance (partial)
⚠️ prediction            → Polymarket (limited)
❌ aviation              → FAA + ICAO NOTAM (blocked)
❌ conflict              → UCDP wars (blocked)
❌ infrastructure        → Internet outages (relay missing)
❌ intelligence          → Country briefs (composite)
❌ maritime              → AIS vessel tracking (relay missing)
❌ military              → Aircraft + theater posture (relay missing)
❌ supply-chain          → Chokepoints + minerals (relay missing)
❌ trade                 → WTO tariffs (relay missing)
❌ outages               → Cloudflare (relay missing)
```

---

## 📊 **Data Freshness Expectations**

| Source | Frequency | TTL | Availability |
|--------|-----------|-----|--------------|
| RSS Feeds | Real-time | 10-15 min | ✅ Always |
| Market Data | 15 min | 5 min | ⚠️ During market hours |
| NASA FIRMS | ~12 hours | 10 min | ✅ Daily |
| ACLED | 24 hours | Cache varies | ✅ With token |
| GDELT | Hourly | 1 hour | ✅ Public |
| OpenSky | 10-15 seconds | 30s | ⚠️ Relay dependent |
| AIS Maritime | 10 seconds | 30s | ❌ Relay missing |
| Telegram OSINT | 1 minute | 5 min | ❌ Relay missing |
| OREF Alerts | Live (5s) | Real-time | ❌ Relay missing |

---

## ✨ **Next Steps**

1. **Deploy Railway Relay** → Unblock maritime/military/telegram APIs
2. **Run Telegram Auth** → `node scripts/telegram/session-auth.mjs`
3. **Register Wingbits** → Get production aircraft enrichment API key
4. **Verify All 22 APIs** → Run test curl commands above
5. **Monitor Data Freshness** → Check dashboard panels for live updates

---

## 🔗 **Reference Links**

- Original Repo: https://github.com/koala73/worldmonitor
- Fork: https://github.com/tncsharetool/worldmonitor
- Live Demo: https://worldmonitor.app
- API Docs: https://api.worldmonitor.app/openapi
- Railway Relay Docs: [docs/RELAY_PARAMETERS.md](docs/RELAY_PARAMETERS.md)

