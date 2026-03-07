# Victor's Deployment Plan — app.breaths.live (Phase 1)

**Owner**: Victor (Backend/Infrastructure Engineer)  
**Date**: 2026-03-07  
**Status**: 🟡 READY TO EXECUTE  
**Target**: https://app.breaths.live (Cloudflare Pages + custom domain)

---

## Repository Structure (Correct as of 2026-03-07)

```
┌─────────────────────────────────────────────────────────┐
│ koala73/worldmonitor (UPSTREAM)                         │
│ Original AGPL project — read-only source for reference │
└──────────────────┬──────────────────────────────────────┘
                   │
                   │ fork & extend
                   ↓
┌─────────────────────────────────────────────────────────┐
│ tncsharetool/worldmonitor-aff (CURRENT WORK)            │
│ Team fork with customizations — active development     │
│ Location: d:\AI-KILLS\worldmonitor-aff                  │
│ ✓ Has all code, skills, affiliate config               │
└──────────────────┬──────────────────────────────────────┘
                   │
              MIGRATE TO
                   ↓
┌─────────────────────────────────────────────────────────┐
│ Breaths-Live/worldmonitor (DEPLOY TARGET)              │
│ Production repo for Breaths organization                │
│ Location: d:\AI-KILLS\worldmonitor (empty, to fill)    │
│ = Will be deployed to Cloudflare Pages                  │
└─────────────────────────────────────────────────────────┘
```

---

## 8-Step Deployment Plan

### Step 1: Migrate Code to Breaths-Live/worldmonitor

**Currently**: Code is in `tncsharetool/worldmonitor-aff`  
**Goal**: Move to `Breaths-Live/worldmonitor` for deployment  
**Method**: Git merge (preserves history)

**Execute**:

```bash
# 1. Go to new repo
cd d:\AI-KILLS\worldmonitor
git status
# Should show: On branch main, nothing to commit

# 2. Add old repo as remote
git remote add aff https://github.com/tncsharetool/worldmonitor-aff.git

# 3. Fetch all branches from old repo
git fetch aff

# 4. Merge main branch (allows unrelated histories)
git merge aff/main --allow-unrelated-histories

# 5. Verify merge succeeded
git log --oneline | head -10
# Should show commits from both repos

# 6. Push to new repo
git push origin main

# 7. Verify on GitHub
# Check: https://github.com/Breaths-Live/worldmonitor
# Should now have src/, api/, docs/, package.json, etc.
```

**Verify**:
- [ ] No merge conflicts (if any occur, resolve manually)
- [ ] `package.json` exists  
- [ ] `vite.config.ts` exists  
- [ ] `src/` folder exists with React code  
- [ ] Push succeeds (no 403 errors)

**Sign-off**: Once `Breaths-Live/worldmonitor main` has all code, proceed to Step 2.

---

### Step 2: Verify Local Build (Vite)

**Goal**: Confirm Vite build works before pushing to Cloudflare  
**Location**: d:\AI-KILLS\worldmonitor

**Execute**:

```bash
# 1. Change to new repo
cd d:\AI-KILLS\worldmonitor

# 2. Install dependencies
npm install
# Expected: ~60 sec, creates node_modules/

# 3. Test local dev server (quick check)
npm run dev &
# Expected: "VITE ready in X ms" + "Local: http://localhost:3000"
# Kill after 10 sec: press Ctrl+C

# 4. Test production build
npm run build
# Expected:
#   ✓ built in 45s
#   dist/ folder created
#   dist/index.html exists
#   dist/assets/*.js files exist
```

**Expected Output**:

```
vite v6.4.1 building for production...
✓ 150 modules transformed.

dist/index.html                     12.5 kB │ gzip:   4.1 kB
dist/assets/index-xxxxx.js        820.3 kB │ gzip: 245.6 kB
dist/assets/index-xxxxx.css        48.2 kB │ gzip:   8.5 kB

Build finished successfully.
```

**Sign-off**: 
- [ ] Build exits with code 0
- [ ] `dist/` folder exists
- [ ] All files created without errors

---

### Step 3: Prepare Environment Variables List

**Goal**: Identify minimum env vars for Phase 1 (basic function)  
**Source**: `.env.local.template` + `docs/API_MATRIX.md`

**Execute**:

```bash
# 1. Open .env.local.template to see all vars
cat .env.local.template | grep "^[A-Z_]*="

# 2. Cross-reference with docs/API_MATRIX.md to find "Required: YES"

# 3. Create table of minimum vars (Phase 1):
#    Variables marked "Required" in API_MATRIX
```

**Typical Minimum Vars for Phase 1**:

| Variable | Purpose | Required? | Example |
|---|---|---|---|
| `GROQ_API_KEY` | LLM reasoning (chat panel) | No | `gsk_xxxxx...` |
| `WS_RELAY_URL` | Flight/maritime data relay | No | `https://relay.breaths.live` |
| `VITE_WS_RELAY_URL` | Frontend relay connection | No | `https://relay.breaths.live` |
| `FINNHUB_API_KEY` | Markets data | Optional | `cq123...` |
| `FRED_API_KEY` | Economic indicators | Optional | `xxxxx...` |
| `EIA_API_KEY` | Energy data | Optional | `xxxxx...` |

**Note**: Most are optional — app will gracefully degrade if missing.

**Create env table** (copy into Cloudflare Settings):

```
GROQ_API_KEY = [get from password manager]
WS_RELAY_URL = https://relay.breaths.live
VITE_WS_RELAY_URL = https://relay.breaths.live
FINNHUB_API_KEY = [get if you have it]
FRED_API_KEY = [get if you have it]
EIA_API_KEY = [get if you have it]
[add others as needed]
```

**Sign-off**: 
- [ ] Listed all critical env vars
- [ ] Verified each has a value (or marked as TBD)
- [ ] No hardcoded secrets in code

---

### Step 4: Create Cloudflare Pages Project

**Goal**: Link `Breaths-Live/worldmonitor` repo to Cloudflare for CI/CD  

**Execute on Cloudflare Dashboard**:

1. Go to: https://dash.cloudflare.com/
2. Select your account (likely "Breaths")
3. Sidebar → Pages → Create project
4. Choose: **Connect to Git** → GitHub
5. Select repo:
   - Organization: **Breaths-Live**
   - Repository: **worldmonitor**
   - Branch: **main**
6. Build settings:
   - Framework preset: **Vite** (or None if not listed)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (default)
7. Click **Save and Deploy**
   - First build will start (may fail if env vars missing — OK for now)
   - Wait ~2 min for build to complete or fail
   - Note the deployment logs

**Verify**:
- [ ] Project created in Cloudflare Pages
- [ ] Build triggered (check Deployments tab)
- [ ] Note build status (success/warning/failure)

**Sign-off**:
- [ ] Project URL: `https://worldmonitor.<random>.pages.dev` ✓
- [ ] Build pipeline configured ✓

---

### Step 5: Add Environment Variables in Cloudflare

**Goal**: Store secrets & config in Cloudflare (not in code)  

**Execute on Cloudflare Dashboard**:

1. Go to your Pages project: `https://dash.cloudflare.com/.../Pages/worldmonitor`
2. Sidebar → **Settings** → **Environment variables**
3. Choose environment: **Production**
4. Add each var from your Step 3 table:
   - Click **Add variable**
   - Name: `GROQ_API_KEY`
   - Value: `[paste actual key]`
   - Type: **Encrypted** (default)
   - Click **Save**
5. Repeat for all vars: `WS_RELAY_URL`, `VITE_WS_RELAY_URL`, `FINNHUB_API_KEY`, etc.
6. Once all added, click **Save**

**Verify**:
- [ ] All vars appear in list (values hidden for security)
- [ ] No typos in var names

**Trigger rebuild**:

1. Go to **Deployments** tab
2. Find latest deployment
3. Click **Trigger deployment** / **Redeploy** button
4. Wait ~1-2 min for new build with env vars

**Sign-off**:
- [ ] All env vars saved in Cloudflare
- [ ] Rebuild triggered
- [ ] Build completes (check logs for errors)

---

### Step 6: Link Custom Domain (app.breaths.live)

**Goal**: Point custom domain to Cloudflare Pages deployment  

**Execute on Cloudflare Dashboard**:

1. Go to Pages project → **Deployments** or **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `app.breaths.live`
4. Select zone: **breaths.live** (when prompted)
5. Click **Activate domain**
6. Cloudflare auto-creates DNS CNAME record
7. Wait 1-2 min for SSL/TLS to activate

**Verify DNS**:

```bash
# In terminal (PowerShell)
nslookup app.breaths.live
# Should resolve to Cloudflare Pages IP
```

**Test in browser**:

```
https://app.breaths.live
# Should load your app
# Browser shows "Secure" padlock (SSL active)
```

**Sign-off**:
- [ ] Domain resolves: `https://app.breaths.live`
- [ ] SSL/TLS active (green padlock)
- [ ] Page loads (may show partial data if env vars missing)

---

### Step 7: Test Basic Functionality

**Goal**: Confirm core features work at https://app.breaths.live  

**Execute (Manual Testing)**:

1. **Open app**: https://app.breaths.live
2. **Check console** (F12 → Console):
   - [ ] No critical errors (red)
   - [ ] Warnings OK (yellow)
3. **Test default view** (WORLD variant):
   - [ ] Map renders
   - [ ] Layers panel visible (toggles for conflicts, aviation, maritime, jamming)
   - [ ] Right sidebar panels visible (news, alerts, signals)
4. **Test Travel variant**: `https://app.breaths.live/?variant=travel&dest=paris&days=3`
   - [ ] Page loads
   - [ ] Tabs visible (Explore, Stay, Do, Move)
   - [ ] Images load (no 404s)
5. **Test Finance variant**: `https://app.breaths.live/?variant=finance`
   - [ ] Markets panel appears (if FINNHUB_API_KEY set)
6. **Test Climate variant**: `https://app.breaths.live/?variant=climate`
   - [ ] EIA data shows (if EIA_API_KEY set)

**Check Network Tab** (DevTools → Network):

- [ ] No 500+ server errors
- [ ] API calls return 200 or 503 (graceful fallback OK)
- [ ] Bundle size reasonable (~1-2 MB)

**Record Status** (for step 8 report):

```
WORLD variant: [✓ OK / ⚠️ Partial / ❌ Broken]
  - Map: [✓ OK / ❌ Issue]
  - News panel: [✓ OK / ❌ Issue]
  - Alerts: [✓ OK / ❌ Issue]
  
Travel variant: [✓ OK / ⚠️ Partial / ❌ Broken]
  - UI renders: [✓ OK / ❌ Issue]
  - Affiliate links: [✓ OK / ❌ Issue]
  
Finance variant: [✓ OK / ⚠️ Partial / ❌ Broken]
  - Markets load: [✓ OK / ❌ Issue]

Climate variant: [✓ OK / ⚠️ Partial / ❌ Broken]
  - EIA data: [✓ OK / ❌ Issue]

Errors to fix: [list any critical issues]
```

**Sign-off**:
- [ ] App loads at https://app.breaths.live
- [ ] At least 1 variant rendersi without critical errors
- [ ] Network requests are reasonable

---

### Step 8: Report Back to Owner

**Goal**: Document deployment status for team  

**Format**:

```
STATUS: READY FOR REVIEW — app.breaths.live (Phase 1)

1. REPO & BRANCH
   - Source: Breaths-Live/worldmonitor
   - Branch: main
   - Migration: ✓ Code merged from worldmonitor-aff

2. CLOUDFLARE PAGES
   - Project: worldmonitor
   - Build command: npm run build
   - Output directory: dist
   - URL: https://worldmonitor.<id>.pages.dev
   - Custom domain: https://app.breaths.live ✓

3. ENVIRONMENT VARIABLES (Cloudflare Production)
   - GROQ_API_KEY ✓
   - WS_RELAY_URL ✓
   - VITE_WS_RELAY_URL ✓
   - FINNHUB_API_KEY ✓
   - [list others]

4. DOMAIN & SSL
   - Custom domain: app.breaths.live
   - SSL: ✓ Active
   - DNS: CNAME verified

5. FUNCTIONALITY TEST
   - / (WORLD): ✓ Map OK, News OK, Alerts OK
   - ?variant=travel&dest=paris: ✓ Layout OK, affiliate links OK
   - ?variant=finance: ✓ Markets load (if FINNHUB set)
   - ?variant=climate: ⚠️ Pending EIA_API_KEY
   - Console errors: None critical

6. NEXT STEPS
   - [ ] Complete Phase 2: Full panel configuration
   - [ ] Set up DB/Convex (if needed)
   - [ ] Add monitoring/alerts
   - [ ] Link analytics (affiliate tracking)
   - [ ] Parity test (compare breaths.live vs app.breaths.live)
```

**Send via**: Slack #deployment or GitHub issue/PR comment

**Sign-off**:
- [ ] Report complete
- [ ] Team notified
- [ ] Ready for Phase 2

---

## Timeline Estimate

| Step | Task | Duration |
|---|---|---|
| 1 | Migrate code (git merge) | 15 min |
| 2 | Verify localuild | 10 min |
| 3 | Prepare env vars | 5 min |
| 4 | Create Cloudflare project | 10 min |
| 5 | Add env vars, redeploy | 5 min |
| 6 | Link custom domain | 5 min |
| 7 | Test functionality | 10 min |
| 8 | Write & send report | 5 min |
| **TOTAL** | | **~65 min** |

---

## Rollback Plan (If Needed)

If anything breaks during deployment:

1. **Revert Cloudflare deploystment**:
   - Go to Deployments → click previous successful build → click "Rollback"
   - App reverts to last working version

2. **Revert GitHub push** (if step 1 failed):
   ```bash
   git reset --hard <commit-before-merge>
   git push origin main --force-with-lease
   ```

3. **Keep old repo** (tncsharetool/worldmonitor-aff):
   - Still accessible for reference
   - Can re-deploy from old repo if needed

---

## Questions for Victor

- [ ] Do you have Cloudflare Dashboard access (Breaths organization)?
- [ ] Which env vars do you have actual keys for?
- [ ] Is WS_RELAY_URL configured/running? (needed for flights/maritime data)
- [ ] Any deployment blockers onboarding issues?

---

**Document Version**: 1.0  
**Last Updated**: 2026-03-07  
**Created by**: System (Victor's deployment guide)  
**Reference**: [CLOUDFLARE_DEPLOYMENT_CHECKLIST.md](./CLOUDFLARE_DEPLOYMENT_CHECKLIST.md), [REPO_MIGRATION_BLOCKER.md](./REPO_MIGRATION_BLOCKER.md)
