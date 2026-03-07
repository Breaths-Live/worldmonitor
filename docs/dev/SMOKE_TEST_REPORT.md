# Smoke Test Parity Report — 2026-03-07

**Status**: 🟡 IN PROGRESS  
**Dev Server**: ✅ Running at http://localhost:3000  
**Date**: 2026-03-07  
**Tester**: [Your Name]  
**Duration**: ~15-20 minutes

---

## Quick Start

1. **Open Browser**: Navigate to http://localhost:3000/
2. **Open DevTools**: Press F12 (Chrome/Firefox) or Cmd+Option+I (Safari)
3. **Go to Network Tab**: Watch for API calls as you navigate
4. **Check Console**: Look for any red errors (yellow warnings OK)

---

## Test Scenarios

### Scenario A: WorldMonitor Default (Conflicts Map)

**URL**: http://localhost:3000/ or http://localhost:3000/?variant=world

**Steps**:
1. [ ] Page loads without console errors
2. [ ] Left sidebar appears with layer toggles:
   - [ ] Conflicts layer visible
   - [ ] Aviation layer available (toggleable)
   - [ ] Maritime layer available (toggleable)
   - [ ] Jamming layer visible
3. [ ] Right sidebar shows panels:
   - [ ] Live News panel — fetches headlines
   - [ ] Live Alerts panel — shows emergency alerts
   - [ ] Telegram Signals panel — displays feed

**Expected Network Calls** (DevTools Network tab):

| Endpoint | Status | Response Type | Size |
|---|---|---|---|
| `/api/rss-proxy?url=...` | 200 | JSON | >5KB |
| `/api/oref-alerts` | 200 or 503 | JSON | >1KB |
| `/api/telegram-feed` | 200 | JSON | >2KB |
| `/api/opensky?...` | 200 or 503 | JSON | >5KB |
| `/api/ais-snapshot` | 200 or 503 | JSON | >5KB |
| `/api/gpsjam` | 200 | JSON | >10KB |

**Sign-off**: 
- [ ] No console errors  
- [ ] Panels load data  
- [ ] Map renders without lag  

**Notes**:
```
[Record observations here]
```

---

### Scenario B: Travel Variant (Tour & Booking)

**URL**: http://localhost:3000/?variant=travel&dest=paris&days=3

**Steps**:
1. [ ] DestinationPage loads (Paris)
2. [ ] Hero section displays destination info
3. [ ] Quick actions panel visible (Show on Map, Plan Itinerary, etc.)
4. [ ] **Explore Tab**:
   - [ ] Trending experiences load
   - [ ] Live webcams display (if configured)
   - [ ] No images failing to load
5. [ ] **Stay Tab**:
   - [ ] Hotel cards display with prices
   - [ ] "Book Now" CTA button visible (≥48px height)
   - [ ] Click "Book Now" → **Check URL** — should include SubID like:  
     ```
     https://booking.com/...?aff_id=XXXXX&label=hero_PARIS3d_1
     ```
   - [ ] Opens new tab (no console errors)
6. [ ] **Do Tab**:
   - [ ] Experience cards show with "Book Activity" CTA
   - [ ] Click CTA → URL should have SubID (e.g., `section_a_PARIS_week_2`)
7. [ ] **Move Tab**:
   - [ ] Flight search loads (if enabled)
   - [ ] Transportation options display

**Expected Network Calls**:

| Endpoint | Status | Notes |
|---|---|---|
| `/api/opensky?...` | 200 or 503 | Flights may need relay |
| `/experiences/paris` | 200 | Experience data |
| `/hotels/paris?...` | 200 | Hotel data (affiliate partners) |
| `/webcams/paris` | 200 | Live webcam feeds |

**Sign-off**: 
- [ ] Destination page renders correctly  
- [ ] All tabs load without lag  
- [ ] Affiliate CTAs have SubIDs  
- [ ] No broken image links  

**SubID Audit** (copy actual SubIDs from URLs):
```
Hero CTA SubID: ________________
Stay Card SubID: ________________
Experience CTA SubID: ________________
```

**Notes**:
```
[Record observations here]
```

---

### Scenario C: Finance Variant (Prediction Markets)

**URL**: http://localhost:3000/?variant=finance

**Steps**:
1. [ ] Page loads
2. [ ] Prediction Markets panel displays:
   - [ ] Market list visible with odds
   - [ ] Event details show (category, liquidity, deadline)
   - [ ] Can scroll through multiple markets
3. [ ] Click on a market → shows details/chart (if implemented)
4. [ ] No console errors

**Expected Network Calls**:

| Endpoint | Query | Status | Size |
|---|---|---|---|
| `/api/polymarket` | `endpoint=markets` | 200 | >10KB |
| `/api/polymarket` | `endpoint=events` | 200 | >5KB |

**Sign-off**: 
- [ ] Markets load with data  
- [ ] Odds display correctly  
- [ ] No rate limiting (no 429 responses)  

**Notes**:
```
[Record observations here]
```

---

### Scenario D: Climate Variant (Energy & Environmental Data)

**URL**: http://localhost:3000/?variant=climate

**Steps**:
1. [ ] Page loads
2. [ ] Climate Data panel displays:
   - [ ] Energy prices chart visible
   - [ ] Generation capacity data shows
   - [ ] EIA data loads correctly
3. [ ] Panels don't show "EIA_API_KEY not configured" errors
4. [ ] Data updates periodically (cache visible in Network tab)

**Expected Network Calls**:

| Endpoint | Status | Notes |
|---|---|---|
| `/api/eia/prices` | 200 | Energy price data |
| `/api/eia/capacity` | 200 | Generation capacity |

**Sign-off**: 
- [ ] Data displays without config errors  
- [ ] Charts render correctly  
- [ ] No performance lag  

**Notes**:
```
[Record observations here]
```

---

### Scenario E: Affiliate Link Tracking

**Test Across All Variants**

**Steps**:
1. [ ] Open DevTools → Network tab
2. [ ] Find any "affiliate" or booking links being clicked
3. [ ] Inspect URL in Network tab — verify SubID present
4. [ ] Check local storage / cookies for affiliate tracking (not required yet, TBD)

**Affiliate Tracking Checklist**:

| Partner | Link Found? | SubID Present? | Format Valid? |
|---|---|---|---|
| Booking | [ ] | [ ] `{block}_{dest}{dur}_{pos}` |
| GetYourGuide | [ ] | [ ] `{block}_{dest}{dur}_{pos}` |
| TravelPayouts | [ ] | [ ] `{block}_{dest}{dur}_{pos}` |
| Airalo | [ ] | [ ] `{block}_{dest}{dur}_{pos}` |

**Example Valid SubID**: `hero_PARIS3d_1`  
**Example Invalid SubID**: `paris-3-1` (wrong format)

**Sign-off**: 
- [ ] All affiliate links have SubIDs  
- [ ] SubID format matches spec  
- [ ] Links don't have hardcoded keys  

**Notes**:
```
[Record observations here]
```

---

## Performance Checklist

Test across **3 screen sizes**:

### Desktop (1920x1080)
- [ ] Sidebar width correct
- [ ] Map/panels responsive
- [ ] No layout shifts
- [ ] CTA buttons properly sized

### Tablet (768x1024)
- [ ] Sidebar collapses or stacks
- [ ] Touch targets ≥48px²
- [ ] Text readable (no overflow)
- [ ] Panels stack vertically

### Mobile (375x667)
- [ ] Full mobile layout
- [ ] Buttons accessible
- [ ] No horizontal scroll
- [ ] Forms simplified

---

## Console Errors & Warnings

**Expected**: Yellow warnings (deprecations, style warnings) — OK  
**Not Acceptable**: Red errors — must document & investigate

| Error Message | Endpoint | Severity | Action |
|---|---|---|---|
| (example: "CORS error") | /api/xyz | High | Check _cors.js |
| (example: "EIA key missing") | /api/eia | Low | Expected if env not set |

**Record actual errors**:
```
1. ____________________________
2. ____________________________
3. ____________________________
```

---

## API Reliability Matrix

Rate each endpoint's availability:

| Endpoint | Status (200/503/5xx) | Expected? | Notes |
|---|---|---|---|
| `/api/version` | _____ | ✅ (always) | Health check |
| `/api/_health` | _____ | ✅ (always) | Heartbeat |
| `/api/rss-proxy?url=...` | _____ | ✅ (if relay up) | News feeds |
| `/api/oref-alerts` | _____ | ⚠️ (503 OK) | Graceful fallback |
| `/api/telegram-feed` | _____ | ✅ (if relay) | Telegram signals |
| `/api/opensky?...` | _____ | ⚠️ (503 OK) | Flights (relay dep) |
| `/api/ais-snapshot` | _____ | ⚠️ (503 OK) | Maritime (relay dep) |
| `/api/gpsjam` | _____ | ✅ (usually) | GPS jamming data |
| `/api/polymarket?...` | _____ | ✅ (usually) | Prediction markets |

**Legend**:
- ✅ = Should work even if relay down
- ⚠️ = Expected to fail if relay/env not configured; 503 is expected

---

## Summary & Sign-Off

### Test Coverage

**Variants Tested**:
- [ ] world (default) — conflicts, news, alerts
- [ ] travel (paris, 3 days) — explore, stay, do, move
- [ ] finance — prediction markets
- [ ] climate — EIA energy data

**Issues Found**: 
- Critical (blocks merge): ______
- Medium (needs fix): ______
- Low (nice to fix): ______

### Overall Result

```
[ ] ✅ PASS — All scenarios functional, no critical issues
[ ] ⚠️ PASS WITH WARNINGS — Minor issues found, documented
[ ] ❌ FAIL — Critical issues, do not merge
```

### Final Sign-Off

**Tested By**: _____________________  
**Date**: _____________________  
**Time Spent**: _____ minutes  
**Ready to Merge**: [ ] YES [ ] NO

**Notes for Team**:
```
[Summary of findings]
```

---

## Troubleshooting Guide

If you encounter issues:

### Issue: "Cannot GET /api/xyz"
**Cause**: Endpoint not registered  
**Fix**: Check `api/xyz.js` exists and exports default handler  
**Reference**: [docs/API_MATRIX.md](../API_MATRIX.md)

### Issue: "503 Service Unavailable" on opensky/telegram-feed/ais
**Cause**: WS_RELAY_URL not configured or relay down  
**Fix**: Set `WS_RELAY_URL` in `.env.local`, restart dev server  
**Reference**: [.env.local.template](../../.env.local.template)

### Issue: Affiliate links missing SubID
**Cause**: Link builder not called or SubID not generated  
**Fix**: Check `affiliateLinks.ts`, verify `buildSubId()` called  
**Reference**: [affiliate-ids.md](../../src/features/affiliate/config/affiliate-ids.md)

### Issue: EIA/Polymarket data not loading
**Cause**: API key missing  
**Fix**: Add `EIA_API_KEY` or `FINNHUB_API_KEY` to `.env.local`  
**Reference**: [.env.local.template](../../.env.local.template)

### Issue: Slow page load after variant change
**Cause**: Cache miss or API timeout  
**Fix**: Hard refresh (Ctrl+Shift+R), check Network tab for slow endpoints  
**Reference**: [API_MATRIX.md](../API_MATRIX.md) — caching column

---

## Next Steps After Testing

1. **If PASS**: Move to Task 14 (Skills testing) — run [FINAL_CHECKLIST.md § Task 14](./FINAL_CHECKLIST.md#task-14-test-skills-in-chatagent)
2. **If PASS WITH WARNINGS**: Document issues, create tickets, merge after fixes
3. **If FAIL**: Debug using console errors + Network tab, reference [local-backend-audit.md](../local-backend-audit.md)

---

**Generated**: 2026-03-07  
**Related**: [FINAL_CHECKLIST.md](./FINAL_CHECKLIST.md), [API_MATRIX.md](../API_MATRIX.md)
