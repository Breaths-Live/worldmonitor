# API Matrix — Các endpoints chính & Env configuration

## Tổng quan

Tài liệu này liệt kê đầy đủ các API endpoints trong WorldMonitor, cấu hình env bắt buộc, và trạng thái parity với worldmonitor.app gốc.

### Quy tắc đặt tên Env

- **Required**: Phải có để endpoint hoạt động.
- **Optional**: Có thể không có; endpoint fallback hoặc trả lỗi graceful.
- **Relay-only**: Chỉ hoạt động nếu `WS_RELAY_URL` được cấu hình.

---

## Data & Flight Services

### `/api/opensky` (GET)
- **Purpose**: Real-time flight tracking & aviation data.
- **Required Env**: `WS_RELAY_URL` (relay must support `/opensky`).
- **Optional Env**: `RELAY_SHARED_SECRET`, `RELAY_AUTH_HEADER`.
- **Query Params**: forwarded to relay (no specific schema defined yet).
- **Response**: JSON (relay format).
- **Cache**: public, s-maxage=120, stale-while-revalidate=60.
- **Parity Status**: ✅ Present (routed via relay).
- **Panel**: Travel / Flight tracking.

### `/api/ais-snapshot` (GET)
- **Purpose**: Maritime AIS data snapshot.
- **Required Env**: `WS_RELAY_URL` (relay must support `/ais/snapshot`).
- **Optional Env**: `RELAY_SHARED_SECRET`, `RELAY_AUTH_HEADER`.
- **Auth**: API key validation applied (see `_api-key.js`).
- **Response**: JSON.
- **Cache**: public, s-maxage=180, stale-while-revalidate=300.
- **Parity Status**: ✅ Present (relay-backed).
- **Panel**: Maritime / Logistics.

---

## Climate & Energy Services

### `/api/eia/...` (GET — EIA proxy)
- **Purpose**: Energy Information Administration — energy prices, capacity, economic data.
- **Required Env**: `EIA_API_KEY`.
- **Path**: Any EIA endpoint path (e.g., `/api/eia/v2/...`).
- **Response**: JSON (EIA format).
- **Cache**: varies by endpoint (see code).
- **Parity Status**: ✅ Present (direct EIA integration, not relay-backed).
- **Panel**: Climate / Finance.
- **Notes**:
  - EIA API key must be obtained from https://data.eia.gov/
  - Typical endpoints: `/api/eia/v2/seriesid/{seriesId}`.

---

## Finance & Markets Services

### `/api/polymarket` (GET)
- **Purpose**: Prediction markets — fetch markets, events from Polymarket Gamma API.
- **Query Params**: `endpoint` (markets | events), others forwarded.
- **Required Env**: none (but recommend `WS_RELAY_URL` for production).
- **Optional Env**: `RELAY_SHARED_SECRET`, `RELAY_AUTH_HEADER`, `WS_RELAY_URL`.
- **Auth**: API key validation applied.
- **Rate Limit**: Applied.
- **Response**: JSON.
- **Cache**: success=public, max-age=120; error=public, max-age=10.
- **Parity Status**: ✅ Present (relay or direct Gamma API).
- **Panel**: Finance / Prediction Markets.
- **Notes**:
  - Tries relay first; if unavailable, attempts direct Gamma API fetch.
  - May fail on some environments due to Cloudflare JA3.

---

## Telegram & Real-time Signals

### `/api/telegram-feed` (GET)
- **Purpose**: Real-time Telegram feed (early signals from registered channels).
- **Required Env**: `WS_RELAY_URL` (relay must support `/telegram/feed`).
- **Optional Env**: `RELAY_SHARED_SECRET`, `RELAY_AUTH_HEADER`.
- **Query Params**: `limit` (1–200, default 50), `topic`, `channel`.
- **Response**: JSON.
- **Cache**: public, max-age=10 (near real-time).
- **Parity Status**: ✅ Present (relay-backed, MTProto stateful).
- **Panel**: Telegram Early Signals.

---

## Alert & Event Services

### `/api/oref-alerts` (GET)
- **Purpose**: OREF air-raid / rocket alerts and history.
- **Required Env**: none (optional relay).
- **Optional Env**: `WS_RELAY_URL` (improves coverage).
- **Query Params**: `endpoint` (history | alerts).
- **Response**: JSON.
- **Cache**: history=max-age=30; alerts=max-age=5.
- **Parity Status**: ⚠️ Partial (returns 503 if relay unavailable).
- **Panel**: Alerts / Conflict.

### `/api/gpsjam` (GET)
- **Purpose**: GPS jamming data from gpsjam.org.
- **Required Env**: none (direct fetch, cached in-memory).
- **Response**: JSON (hex H3, jamming percentage, statistics).
- **Cache**: s-maxage=3600 (1 hour).
- **Parity Status**: ✅ Present (direct gpsjam.org integration).
- **Panel**: Jamming / Conflict.
- **Notes**: Caches per-edge-isolate; may vary across regions.

---

## Content & Meta Services

### `/api/story` (GET)
- **Purpose**: HTML story page with og:image & twitter:card meta tags for crawler bots.
- **Required Env**: none.
- **Query Params**: `c` (country code), `t` (type), `ts`, `s` (score), `l` (level).
- **Response**: HTML.
- **Parity Status**: ✅ Present (bot detection + redirect).
- **Notes**: Real users redirected to SPA; bots served meta-rich HTML.

### `/api/og-story` (GET)
- **Purpose**: Dynamic SVG OG image (1200x630) for social meta preview.
- **Required Env**: none.
- **Query Params**: `c`, `t`, `s`, `l`.
- **Response**: SVG image/svg+xml.
- **Cache**: public, max-age=3600.
- **Parity Status**: ✅ Present.

### `/api/download` (GET)
- **Purpose**: Redirect to latest GitHub release asset (desktop app).
- **Query Params**: `platform` (windows-exe | macos-arm64 | linux-appimage…), `variant` (optional).
- **Required Env**: none.
- **Response**: 302 redirect to browser_download_url.
- **Parity Status**: ✅ Present (but references tncsharetool fork).

---

## RSS & News Feeds

### `/api/rss-proxy` (GET)
- **Purpose**: Proxy RSS feeds with domain whitelist and relay fallback.
- **Query Params**: `url` (feed URL).
- **Required Env**: none.
- **Optional Env**: `WS_RELAY_URL` (fallback for strict CORS/JA3 environments).
- **Auth**: API key validation may apply.
- **Rate Limit**: Applied.
- **Response**: XML/RSS.
- **Cache**: success=max-age=180; error=max-age=15.
- **Parity Status**: ✅ Present (large whitelist, relay fallback).
- **Panel**: News / RSS.
- **Notes**:
  - Long whitelist in `rss-proxy.js` — add domains here if expanding.
  - Validates redirects to prevent domain escape.

---

## Registration & Interest Services

### `/api/register-interest` (POST)
- **Purpose**: Capture email interest/feedback via Convex mutation.
- **Required Env**: `CONVEX_URL`.
- **Body**: JSON `{ email, source?, appVersion? }`.
- **Auth**: Rate-limited per IP (5 per hour).
- **Response**: JSON.
- **Parity Status**: ✅ Present (affiliate/monetization endpoint).
- **Panel**: Footer / CTA.

---

## System & Health

### `/api/_health` (GET)
- **Purpose**: Health check; reports presence of critical env keys.
- **Response**: JSON `{ ok, timestamp, keys, nodeEnv }`.
- **Parity Status**: ✅ Present.
- **Used by**: Monitoring, CI/CD pipelines.

### `/api/version` (GET)
- **Purpose**: Latest app version from upstream GitHub release.
- **Response**: JSON `{ version, tag, url, prerelease }`.
- **Cache**: public, s-maxage=300.
- **Parity Status**: ✅ Present (references koala73 upstream).

---

## Deployment Requirements Checklist

- [ ] Production (Cloudflare):
  - [ ] `WS_RELAY_URL` — configured and tested.
  - [ ] `RELAY_SHARED_SECRET` — if relay auth required.
  - [ ] `EIA_API_KEY` — registered with EIA.
  - [ ] `CONVEX_URL` — configured for register-interest.
  - [ ] Environment variables in Cloudflare Worker settings.

- [ ] Staging / Vercel Dev:
  - [ ] `.env.local` with test values (see `.env.local.example`).
  - [ ] Relay URL pointing to staging relay (if available).

- [ ] All Environments:
  - [ ] CORS whitelist in `_cors.js` matches deployment domains.
  - [ ] RSS proxy domain whitelist current (check `rss-proxy.js`).

---

## Future Additions (TODO)

- [ ] Document API key requirements (which endpoints require keys).
- [ ] Add example cURL commands for each endpoint.
- [ ] Document expected response schemas.
- [ ] Parity checklist vs worldmonitor.app.

---

**Last updated**: 2026-03-07 (Victor agent)
**Owner**: Victor  
**Related files**:
- `docs/dev/victor-api-endpoints.md` — detailed endpoint list.
- `.agen/skills/WORLDMONITOR/SKILL.md` — architecture overview.
