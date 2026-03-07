# Panel-Data Map — Từng UI Panel → Các API Sources & Data Services

## Mục tiêu

Tài liệu này ánh xạ mỗi UI panel trong WorldMonitor app tới các API endpoint, service, và data source cung cấp dữ liệu cho panel đó.

Sử dụng tài liệu này khi:
- Thêm panel mới → hãy xác định endpoint nào sẽ cung cấp dữ liệu.
- Debug một panel bị hỏng → kiểm tra API sources của nó.
- Refactor hoặc tối ưu panel → tìm hiểu tất cả dependencies.

---

## Panels - Map tổng quát

### MAP LAYERS (Left sidebar / Deck.gl)

#### Conflicts / Political Instability Layer
- **Primary Data**: Conflict/CII scores (proprietary or ACLED).
- **Endpoints**: 
  - (Internal computation or ACLED API — via relay if configured)
  - `/api/oref-alerts` (for OREF escalation in certain regions).
- **Config**: `src/config/layers/conflictLayer.ts` (hypothetical).
- **Refresh**: Real-time or periodic.
- **Status**: ✅ Present (OREF alerts integrated).

#### Military / Aviation Layer
- **Primary Data**: Real-time flight data, AIS/maritime.
- **Endpoints**:
  - `/api/opensky` — live flights.
  - `/api/ais-snapshot` — maritime vessels.
- **Config**: `src/config/layers/aviationLayer.ts`, `src/config/layers/maritimeLayer.ts`.
- **Refresh**: Frequent (every 10–60 seconds).
- **Status**: ✅ Present.

#### GPS Jamming Layer
- **Primary Data**: H3 hex grid jamming percentages.
- **Endpoints**:
  - `/api/gpsjam` — direct fetch from gpsjam.org.
- **Config**: `src/config/layers/jammingLayer.ts`.
- **Refresh**: Hourly (cache TTL 1 hour).
- **Status**: ✅ Present.

#### Weather / Climate Overlay
- **Primary Data**: Radar, alerts, environmental conditions.
- **Endpoints**:
  - `/api/eia/...` — energy/climate indicators.
  - (External weather APIs via relay if configured).
- **Config**: `src/config/layers/weatherLayer.ts`.
- **Status**: ⚠️ Partial (EIA indicators; full weather may require relay).

---

### RIGHT SIDEBAR PANELS

#### Live News Panel
- **Primary Data**: Headlines and videos from global news agencies.
- **Endpoints**:
  - `/api/rss-proxy?url=...` — fetches RSS of whitelisted news sources.
- **Config**: `src/config/panels/liveNewsPanel.ts` or `src/data/blogPosts.ts`.
- **Refresh**: Every 5–15 minutes.
- **Data Source**: BBC, Reuters, CNN, Al Jazeera, etc. (see rss-proxy whitelist).
- **Status**: ✅ Present.

#### Live Webcams Panel
- **Primary Data**: Camera feeds and metadata.
- **Endpoints**:
  - (Likely config-driven; no single API endpoint listed yet).
- **Config**: `src/config/liveWebcams.ts` or `src/config/panels/liveWebcamsPanel.ts`.
- **Data Source**: Likely external provider (Webcam Asia, etc.) via manifest.
- **Status**: ⚠️ May need endpoint definition.

#### AI Insights Panel
- **Primary Data**: LLM-generated summaries for analyzed regions.
- **Endpoints**:
  - (Likely via Convex or internal endpoint — not listed in current API survey).
- **Models**: GROQ, OpenRouter, etc. (see `_health.js` for key checks).
- **Config**: `src/config/panels/aiInsightsPanel.ts`.
- **Status**: ⚠️ Possible hidden endpoint or Convex mutation.

#### Prediction Markets Panel (Finance Variant)
- **Primary Data**: Polymarket market data, odds, activity.
- **Endpoints**:
  - `/api/polymarket?endpoint=markets` — for active markets list.
  - `/api/polymarket?endpoint=events` — for event details.
- **Config**: `src/config/variants/finance/predictionsPanel.ts`.
- **Refresh**: Every 30–120 seconds (market-dependent).
- **Status**: ✅ Present.

#### Alerts Panel
- **Primary Data**: OREF, emergency broadcast, air-raid alerts.
- **Endpoints**:
  - `/api/oref-alerts` — primary source.
  - `/api/oref-alerts?endpoint=history` — historical data.
- **Config**: `src/config/panels/alertsPanel.ts`.
- **Refresh**: Real-time or every few seconds.
- **Coverage**: Israel/Ukraine primarily; fallback to 503.
- **Status**: ✅ Present (with graceful fallback).

#### Telegram Signals Panel
- **Primary Data**: Early signals from registered Telegram channels (trades, alerts, rumors).
- **Endpoints**:
  - `/api/telegram-feed` — real-time feed.
  - Params: `limit`, `topic`, `channel`.
- **Config**: `src/config/liveChannels.ts` (channel list).
- **Data Source**: `data/telegram-channels.json` (static config of channel mappings).
- **Refresh**: Real-time (cache max-age=10).
- **Status**: ✅ Present.

---

## TRAVEL TAB (Lucky App)

### Explore Tab
- **Discover trending destinations, itineraries, live webcams.**
- **Data Sources**:
  - Static config: `src/config/destinations.ts` or `src/data/destinations.json`.
  - Live webcams: `/api/liveWebcams` (hypothetical) or config-driven.
  - Experiences: Config or `/api/experiences` (if endpoint exists).
- **Affiliate Panels**: Trending tours, experiences grid.
- **Status**: Depends on backend experience API presence.

### Stay Tab
- **Hotel, accommodation discovery & booking.**
- **Data Sources**:
  - Config: `src/config/affiliatePartners/hotels.ts`.
  - Affiliate API: Travelpayouts, Booking.com via affiliateLinks builder.
- **CTA**: "Book now" → via affiliate link with SubID tracking.
- **Status**: ✅ Ready for affiliate integration.

### Do Tab
- **Experiences, tours, activities.**
- **Data Sources**:
  - Config: `src/config/affiliatePartners/experiences.ts`.
  - Primary affiliate: GetYourGuide, Viator, local tour operators.
- **CTA Flow**: See experience → Read full review (blog) → Book via affiliate.
- **Status**: ✅ Ready for affiliate integration.

### Move Tab
- **Transport: flights, trains, car rentals, local transit.**
- **Data Sources**:
  - Flights: `/api/opensky` (real-time availability + pricing via Skyscanner/Travelpayouts).
  - Trains: Config-driven or `/api/trains` (if endpoint exists).
  - Car rentals: DiscoverCars, Hertz via affiliate.
  - Transit: Google Maps or local transit provider.
- **Status**: Partial (flights data available; booking via affiliate).

---

## CLIMATE VARIANT

### Climate Data Panel
- **Temperature, emissions, renewable trends.**
- **Data Sources**:
  - `/api/eia/...` — energy prices, capacity data.
  - External climate APIs (via relay if available).
- **Config**: `src/config/variants/climate/climatePanels.ts`.
- **Status**: ⚠️ EIA data present; full climate suite may need more sources.

---

## FINANCE VARIANT

### Markets Panel
- **Stock indices, commodities, forex.**
- **Data Sources**:
  - `/api/polymarket` — prediction markets odds & events.
  - (External market data provider — not yet listed in API endpoints).
- **Config**: `src/config/variants/finance/marketsPanel.ts`.
- **Status**: ⚠️ Polymarket present; equity/commodity data may be missing endpoint.

---

## HEALTH VARIANT

### Health Alerts Panel
- **Disease outbreaks, vaccine info, health emergencies.**
- **Data Sources**:
  - `/api/rss-proxy?url=...` — CDC, WHO, ECDC RSS feeds.
  - (Possible dedicated health API — not listed yet).
- **Config**: `src/config/variants/health/healthPanels.ts`.
- **Feeds**: CDC, WHO, ECDC (whitelisted in rss-proxy).
- **Status**: ✅ RSS feed integration present; dedicated endpoint may enhance.

---

## AFFILIATE / MONETIZATION PANELS

### Affiliate Cards (Experiences, Hotels, Tours, etc.)
- **Data Source**: Static config + dynamic affiliate link builder.
- **Endpoints**:
  - `/api/register-interest` — capture user interest email.
  - (No dedicated affiliate tracking endpoint yet — may need to add).
- **Config**: `src/features/affiliate/config/affiliateLinks.ts`.
- **SubID Format**: `{block}_{destination}{duration}_{position}`.
- **Status**: ✅ Config framework ready; links & tracking infrastructure in progress.

### Blog / Guide Links
- **Data Source**: `src/data/blogPosts.ts` or config.
- **Destination**: guide.breaths.live subdomain (funnel/content site).
- **CTA**: "Read full guide →".
- **Status**: Ready for integration (subdomains & content structure TBD).

---

## TODO & Gaps Identified

- [ ] **Missing endpoints** (need Victor to create or document):
  - `/api/experience?destination=...&duration=...` — for Dynamic booking data.
  - `/api/liveWebcams` — central webcam list & metadata API.
  - `/api/aiInsights` — if LLM summaries served from API.
  - `/api/markets?symbols=...` — equity/commodity/forex data.
  - `/api/trains?route=...` — train schedules & pricing.

- [ ] **Missing affiliate tracking endpoint**:
  - `/api/trackAffiliateClick` — log clicks & conversions for analytics.

- [ ] **Full parity audit** against worldmonitor.app needed:
  - Compare layer implementations.
  - Validate cache strategies.

---

## How to Update This Map

When **Victor** adds a new endpoint:
1. Add entry to `docs/API_MATRIX.md`.
2. Update corresponding panel/section here in `PANEL_DATA_MAP.md`.
3. Note status: ✅ Present, ⚠️ Partial, or ❌ Missing.

When **Lucky** adds a new UI panel:
1. Identify required data sources (endpoints or config).
2. List them here in a new section.
3. Check if corresponding API endpoints exist (consult Victor).
4. If missing, create a task to add endpoint.

---

**Last updated**: 2026-03-07 (Victor agent)  
**Owner**: Victor (data engineer) & Lucky (UI engineer)  
**Related files**:
- `docs/API_MATRIX.md` — detailed endpoint list.
- `src/config/` — panel and variant configs.
- `.agen/skills/WORLDMONITOR/SKILL.md` — architecture.
