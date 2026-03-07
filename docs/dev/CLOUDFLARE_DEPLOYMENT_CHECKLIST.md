# Cloudflare Pages Deployment Checklist — Breaths-Live/worldmonitor

**Status**: 🟡 STARTING  
**Date**: 2026-03-07  
**Owner**: Victor (Backend/Infrastructure)  
**Target**: Production deployment at https://app.breaths.live  
**Timeline**: Phase 1 (basic functionality)

---

## Repo Structure (Clarified)

- **Source (Upstream)**: [koala73/worldmonitor](https://github.com/koala73/worldmonitor) — Original AGPL project
- **Team Fork (Legacy)**: [tncsharetool/worldmonitor-aff](https://github.com/tncsharetool/worldmonitor-aff) — Current working repo (reference)
- **Deploy Target**: [Breaths-Live/worldmonitor](https://github.com/Breaths-Live/worldmonitor) — Production repo (new org)

---

## Executive Summary

Migrate working code from main branch (tncsharetool/worldmonitor-aff) → **Deploy repo (Breaths-Live/worldmonitor)**.

Deploy via Cloudflare Pages with Vite build, custom domain app.breaths.live, minimum env config for Phase 1.

---

## Step 1: Migrate Code to Breaths-Live/worldmonitor ✓ TODO

**Goal**: Copy working code from `tncsharetool/worldmonitor-aff` → `Breaths-Live/worldmonitor` (deploy target)

### Action Items

1. **Verify Breaths-Live/worldmonitor is cloned** (should already exist):
```bash
cd d:\AI-KILLS\worldmonitor
git status
# Should show: On branch main
git remote -v
# Should show: origin https://github.com/Breaths-Live/worldmonitor.git
```

2. **Add old repo as remote**:
```bash
cd d:\AI-KILLS\worldmonitor
git remote add aff https://github.com/tncsharetool/worldmonitor-aff.git
git fetch aff
# Downloads all branches from old repo
```

3. **Merge code from old repo into new repo**:
```bash
git merge aff/main --allow-unrelated-histories
# If conflicts: resolve manually, then git add . && git commit
```

4. **Push merged code to new repo**:
```bash
git push origin main
# Uploads code to Breaths-Live/worldmonitor
```

5. **Verify on GitHub**:
- Go to: https://github.com/Breaths-Live/worldmonitor
- Check: main branch now has `src/`, `api/`, `package.json`, `vite.config.ts`, etc.
- View: https://github.com/Breaths-Live/worldmonitor/commits/main (should show aff commits)

### Notes
- **Upstream source**: koala73/worldmonitor (read-only for reference)
- **Current work**: tncsharetool/worldmonitor-aff (legacy, now merged)
- **Deploy target**: Breaths-Live/worldmonitor (new org repo, now populated)
- **Future commits**: ALL go to Breaths-Live/worldmonitor → main branch
- **Skills docs**: Will migrate after deployment

**Status**: [ ] TODO  
**Verified**: [ ] Breaths-Live/worldmonitor has all code from aff

---

## Step 2: Verify Local Build (Vite) ✓ TODO

### Action Items

- [ ] Install dependencies:
```bash
npm install
```
- [ ] Test build locally:
```bash
npm run build
```
- [ ] Verify output:
  - [ ] Build exits with code 0 (success)
  - [ ] `dist/` folder created at root
  - [ ] `dist/index.html` exists
  - [ ] Vite logs show bundle size + output dir

**Expected Output**:
```
vite v6.x.x building for production...
✓ built in 45.2s

dist/index.html                  12.5 kB │ gzip:  4.1 kB
dist/assets/index.xxxxx.js      820.3 kB │ gzip: 245.6 kB
dist/assets/index.cssxxx.css     48.2 kB │ gzip:  8.5 kB
```

**Cloudflare Settings** (to remember):
- Build command: `npm run build`
- Output directory: `dist`

### Troubleshooting

| Issue | Cause | Fix |
|---|---|---|
| "Cannot find module 'vite'" | Dependencies missing | Run `npm install` |
| "dist/ not created" | Build failed | Check error output above, fix TypeScript/syntax errors |
| "node_modules too large" | Bloat | Run `npm ci` instead of `npm install` |

**Status**: [ ] TODO  
**Build Verified**: [ ] Yes (dist/ created & valid)

---

## Step 3: Prepare Minimum ENV Variables 🔑 TODO

### Reference

Check the documentation files:
- [ ] `docs/API_MATRIX.md` (if exists in new repo) — required env vars
- [ ] `.env.local.template` or similar in new repo
- [ ] `vite.config.ts` — which env vars are used at build time vs runtime

### Identify Required Variables

Based on Breaths-Live/worldmonitor typical stack (ADJUST per actual docs):

| Category | Variable | Required? | Example Value |
|---|---|---|---|
| **Vite/Build** | VITE_API_BASE_URL | ? | `https://api.breaths.live` |
| **Relay** | VITE_WS_RELAY_URL | ? | `wss://relay.breaths.live` |
| **AI** | GROQ_API_KEY | ? | (keep secret) |
| **Markets** | FINNHUB_API_KEY | ? | (keep secret) |
| **Economics** | FRED_API_KEY | ? | (keep secret) |
| **Maps/GIS** | MAPBOX_TOKEN | ? | (if used) |
| **Telegram** | TELEGRAM_BOT_TOKEN | ? | (if relay-backed, already handled) |

### Task: Create Minimal ENV List

**In the new repo, identify**:
1. Open `vite.config.ts` → grep for `import.meta.env.VITE_*`
2. Open `.env.local.template` or similar → note marked as "required" or "phase 1"
3. Create a short table (3-5 must-have variables):

**Example Minimal List for Phase 1**:
```
VITE_WS_RELAY_URL = "wss://relay.staging.breaths.live" (or production)
GROQ_API_KEY = "gsk_..." (or alternative LLM key)
FINNHUB_API_KEY = "xxxxx" (for Markets panel, optional if no panel yet)
MAPBOX_TOKEN = "pk_..." (for map rendering, critical)
```

### Special Note: Build-Time vs Runtime

- **Build-time** (VITE_* prefix): Baked into `dist/` at build time. Set in Cloudflare.
- **Runtime** (non-VITE prefix): Can be set server-side. TBD.

For Phase 1, assume all env vars must be set in Cloudflare.

**Status**: [ ] TODO  
**ENV Variables Identified**: [ ] List completed below:

```
1. ________________________________ = ________________________________
2. ________________________________ = ________________________________
3. ________________________________ = ________________________________
4. ________________________________ = ________________________________
5. ________________________________ = ________________________________
```

---

## Step 4: Create Cloudflare Pages Project 🚀 TODO

### Prerequisites

- [ ] Cloudflare account active
- [ ] GitHub account connected to Cloudflare (if not: do it now in Cloudflare Dashboard)

### Action Items

1. [ ] Go to **Cloudflare Dashboard** → **Pages** → **Create project**
2. [ ] Select **"Connect to Git"**
3. [ ] **Authorize GitHub** if prompted
4. [ ] **Search for repo**: `Breaths-Live/worldmonitor`
5. [ ] **Click to select** the repo
6. [ ] **Choose branch**: `main`
7. [ ] **Set build configuration**:
   - Framework preset: **Vite** (or "None" if auto-detect fails)
   - Build command: `npm run build` (copy-paste exactly)
   - Build output directory: `dist` (copy-paste exactly)
8. [ ] [ ] **Save and Deploy** → Cloudflare will run first build

### Expected Outcome

- [ ] Build starts (can take 2-5 minutes)
- [ ] Cloudflare generates deployment URL: `https://xxxxxxxx.pages.dev`
- [ ] If build fails → check error log (likely missing env var — expected for Phase 1)
- [ ] If build succeeds → proceed to Step 5

### Troubleshooting Build Failures

**Error**: "Build failed — missing WS_RELAY_URL"  
→ Expected if env not set yet. Proceed to Step 5.

**Error**: "npm: command not found"  
→ Cloudflare can't find npm. Check: Framework preset should detect Node.js auto.

**Error**: "node_modules bloated / timeout"  
→ Check `package.json` for unnecessary deps. Remove or Star a new ticket.

**Status**: [ ] TODO  
**Cloudflare Project Created**: [ ] Yes  
**Deployment URL**: ___________________________

---

## Step 5: Add Environment Variables to Cloudflare 🔐 TODO

### Action Items

1. [ ] Go to **Cloudflare Dashboard** → **Pages** → Select your project (`worldmonitor`)
2. [ ] Go to **Settings** tab → **Environment variables**
3. [ ] Under **Production** environment:
   - [ ] Click **Add variable**
   - [ ] For each variable from Step 3:
     - Variable name: `VITE_WS_RELAY_URL`
     - Value: `wss://relay.breaths.live` (get actual value from team/docs)
     - Click **Save**
   - Repeat for all 3-5 variables
4. [ ] Verify all variables added (should show in table)
5. [ ] Go to **Deployments** tab
6. [ ] Select **most recent deployment** → Click **Retry Deployment**
   - Cloudflare will rebuild with env vars set
   - This time, build should succeed (or fail gracefully with "panel pending" message)

### Checklist of Added Variables

| Variable | Value (Encrypted) | Verified |
|---|---|---|
| VITE_WS_RELAY_URL | ✓ | [ ] |
| GROQ_API_KEY | ✓ | [ ] |
| FINNHUB_API_KEY | ✓ | [ ] |
| (variable 4) | ✓ | [ ] |
| (variable 5) | ✓ | [ ] |

**Status**: [ ] TODO  
**Variables Set in Cloudflare**: [ ] Yes

---

## Step 6: Configure Custom Domain 🌐 TODO

### Prerequisites

- [ ] Domain `breaths.live` already managed in Cloudflare (should be, if migrating from old setup)
- [ ] Subdomain `app.breaths.live` **not yet used** elsewhere

### Action Items

1. [ ] Go to **Cloudflare Dashboard** → **Pages** → Select project `worldmonitor`
2. [ ] Go to **Custom domains** tab
3. [ ] Click **Set up a custom domain**
4. [ ] Enter: `app.breaths.live`
5. [ ] When asked "Which zone?": Select `breaths.live`
6. [ ] Cloudflare auto-configures CNAME record
7. [ ] Wait 1-2 minutes for DNS propagation
8. [ ] Check SSL status:
   - Should show: "Active Certificate" ✓
   - If pending: wait up to 15 min

### Verify Domain Active

```bash
nslookup app.breaths.live
# Should resolve to Cloudflare IP or CNAME to *.pages.dev
```

Or just open browser: `https://app.breaths.live` (if working, no cert warning)

**Status**: [ ] TODO  
**Custom Domain Configured**: [ ] Yes  
**SSL Active**: [ ] Yes

---

## Step 7: Test Deployed App 🧪 TODO

### Smoke Test Checklist

#### 7A: Open App
- [ ] Navigate to `https://app.breaths.live/`
- [ ] Page loads (might take 30 sec on first load)
- [ ] No immediate crash (JavaScript errors in console are expected, env vars missing okay)

#### 7B: Open DevTools & Check Console
- [ ] Press F12 → Console tab
- [ ] Expected: No red JS errors like "Cannot read property of undefined"
- [ ] OK: Yellow warnings ("deprecated", "missing env")
- [ ] OK: Messages like "WS_RELAY_URL not configured" if env truly missing

#### 7C: Check Network Tab
- [ ] Reload page → watch Network tab
- [ ] Expect: `index.html` (200) + assets (JS/CSS, 200)
- [ ] Expect: API calls to `/api/*` endpoints (might be 500 if env missing, okay for Phase 1)
- [ ] NOT OK: 404 on `/api/health` (missing endpoint) vs 503 on `/api/relay-dependent` (relay down, okay)

#### 7D: Test Variants (if query params work)

| URL | Expected | Result |
|---|---|---|
| `https://app.breaths.live/` | Default view (world/conflicts map) | [ ] Works [ ] Bug |
| `https://app.breaths.live/?variant=world` | Same as default | [ ] Works [ ] Bug |
| `https://app.breaths.live/?variant=travel` | Travel/tours layout | [ ] Works [ ] Bug |
| `https://app.breaths.live/?variant=climate` | Climate/energy layout | [ ] Works [ ] Bug |

#### 7E: Test Key Panels (if visible)

| Panel | Expected | Result |
|---|---|---|
| Map/Map Layers | Map renders, can toggle layers | [ ] Works [ ] Pending |
| Live News | At least 1 news item shows | [ ] Works [ ] Pending (no RSS) |
| Live Webcams | At least 1 webcam thumbnail | [ ] Works [ ] Pending (no data) |
| Markets (Finance variant) | Market odds display | [ ] Works [ ] Pending (no key) |

#### 7F: Record Logs

If errors appear, check Cloudflare build logs:
- [ ] **Cloudflare Dashboard** → **Pages** → **worldmonitor** → **Deployments**
- [ ] Click latest deployment → **View build log**
- [ ] Copy any relevant error messages (troubleshooting section)

**Status**: [ ] TODO  
**App Loads at app.breaths.live**: [ ] Yes  
**No Critical JS Errors**: [ ] Yes  

---

## Step 8: Report Status & Next Steps 📋 TODO

When all steps complete, fill out the status report below & send to team:

---

### 📊 DEPLOYMENT STATUS REPORT

```
STATUS: PHASE 1 DEPLOYMENT COMPLETE

Primary Repo
- URL: https://github.com/Breaths-Live/worldmonitor
- Branch: main
- Build Type: Vite (React)

Cloudflare Pages Configuration
- Project Name: worldmonitor
- Build Command: npm run build
- Output Directory: dist
- Environment: Production

Deployed Domain
- URL: https://app.breaths.live
- SSL/TLS: Active ✓
- Custom Domain: Configured ✓

Environment Variables Set (Production)
- VITE_WS_RELAY_URL: ✓
- GROQ_API_KEY: ✓
- FINNHUB_API_KEY: ✓
- (other) ✓

Build & Deployment
- Latest Deployment: 2026-03-07 HH:MM
- Build Status: SUCCESS / PENDING / FAILED
- Build Log: https://dash.cloudflare.com/[link to logs]

Functional Testing Results

1. Default Variant (WORLD)
   - Map renders: ✓ YES / ❌ NO
   - Live News panel: ✓ YES / ⏳ PENDING / ❌ NO
   - Live Webcams: ✓ YES / ⏳ PENDING / ❌ NO
   - Status: [READY / PARTLY WORKING / NEEDS DEBUG]

2. Travel Variant (?variant=travel)
   - Page loads: ✓ YES / ❌ NO
   - Layout renders: ✓ YES / ❌ NO
   - Affiliate data: ⏳ PENDING (feature TBD Sprint 2)
   - Status: [READY / PARTLY WORKING / NOT YET]

3. Climate Variant (?variant=climate)
   - Page loads: ✓ YES / ❌ NO
   - EIA data: ✓ YES / ⏳ PENDING / ❌ NO
   - Status: [READY / PENDING / ERROR]

Console & Network
- JS Errors (critical): ❌ NONE / ⚠️ [list]
- API Errors (expected if env missing): ✓ ACCEPTABLE
- Performance: Load time < 3s (on good connection) / Measured: ____ ms

Known Issues (Phase 1)
- Panel XYZ pending key YYY
- Relay endpoint down (expected, check with ops)
- [other observations]

Next Steps
1. [ ] Migrate skills documentation from old repo → new repo
2. [ ] Run full parity test (docs/parity-checklist.md)
3. [ ] Deploy Phase 2 features (travel variants, more panels)
4. [ ] Integrate analytics (SubID tracking, user events)

Approver Needed
- [ ] Owner (Trần Ngọc Chuyền) — sign off on production readiness
- [ ] DevOps — verify Cloudflare config matches security policy
- [ ] QA — run full regression test

---

Report Created: 2026-03-07 by Victor  
Approved: _________________ (date)  
```

---

## Troubleshooting & Support

### Build Errors

**"build failed: Cannot find module 'X'"**
- Check: `npm install` completed successfully
- Check: `package.json` has dependency listed
- Fix: Run `npm ci && npm run build` again

**"VITE_WS_RELAY_URL not working in app"**
- Check: Variable set in Cloudflare Production env (not preview)
- Check: Variable name includes `VITE_` prefix (build-time only)
- Fix: Rebuild deployment after env var added

### Runtime Errors

**"App loads but blank page / CSS missing"**
- Check: DevTools → Network: verify CSS files load (200 status)
- Check: Console errors about asset path (wrong base URL)
- Fix: Check `vite.config.ts` for `base:` setting

**"API calls failing 500"**
- Check: API endpoints exist in backend (if self-hosted)
- Check: Env var points to correct API host
- Check: CORS headers configured (check _cors.js in old repo, migrate if needed)

### DNS/Domain Issues

**"DNS timeout / can't reach app.breaths.live"**
- Check: CNAME record exists: `app.breaths.live CNAME xxxxxx.pages.dev`
- Check: SSL certificate active in Cloudflare
- Fix: Flush DNS cache, wait 5-10 minutes, retry

### Support Resources

- Cloudflare Pages docs: https://developers.cloudflare.com/pages/
- Vite build docs: https://vitejs.dev/config/
- GitHub actions logs (if using): Cloudflare Dashboard → Deployments tab

---

## Sign-Off

**Deployment Checklist**: ___/8 steps complete  
**Verified by**: _________________ (name)  
**Date**: 2026-03-07  
**Status**: 🟢 READY / 🟡 IN PROGRESS / 🔴 BLOCKED

---

## Appendix: File Locations (for Reference)

**In new repo (Breaths-Live/worldmonitor)**:
- Build config: `vite.config.ts`
- Package info: `package.json`
- Env template: `.env.local.template` or `.env.example`
- API docs: `docs/API_MATRIX.md` (if migrated from old repo)
- Deployment logs: Cloudflare Dashboard (external)

**In old repo (tncsharetool/worldmonitor-aff)** — reference only:
- Skills: `.agen/skills/`
- API documentation: `docs/API_MATRIX.md`, `docs/PANEL_DATA_MAP.md`
- Environment guide: `src/features/affiliate/config/affiliate-ids.md`
- Deploy checklist: `docs/dev/FINAL_CHECKLIST.md`

**Action**: After new repo stabilizes, **migrate skills & docs** from old → new.

---

**Version**: 1.0  
**Last Updated**: 2026-03-07  
**Owner**: Victor (Backend/Infrastructure)
