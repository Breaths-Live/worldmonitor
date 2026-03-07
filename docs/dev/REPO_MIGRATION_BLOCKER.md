# Repository Migration Plan — Code Transfer to Breaths-Live/worldmonitor

**Status**: 🔴 BLOCKER  
**Date**: 2026-03-07  
**Issue**: Breaths-Live/worldmonitor repo is empty; actual code is in tncsharetool/worldmonitor-aff

---

## Repo Hierarchy (Clarified)

```
koala73/worldmonitor (UPSTREAM SOURCE — original AGPL project)
    ↓
tncsharetool/worldmonitor-aff (TEAM FORK — current working repo with customizations)
    ↓
Breaths-Live/worldmonitor (DEPLOY TARGET — production repo for Breaths org)
```

### Current Situation

**Upstream** (koala73/worldmonitor)
- URL: https://github.com/koala73/worldmonitor (original AGPL source)
- Status: Reference only (read-only, track for updates)

**Working Repo** (tncsharetool/worldmonitor-aff)
- URL: https://github.com/tncsharetool/worldmonitor-aff
- Status: **Has all production code** ✓
- Contains: Vite app, API endpoints, skills documentation, affiliate config, env setup
- Currently: Active development branch here

**Deploy Target** (Breaths-Live/worldmonitor)
- URL: https://github.com/Breaths-Live/worldmonitor
- Status: **Empty** (only README, LICENSE, .gitignore)
- Branch: main only
- No `vite.config.ts`, `package.json`, or source code
- Intended: Production deployment repo for Breaths organization

---

## Decision Required

Victor should choose **one of two paths**:

### Option A: Migrate Code to Breaths-Live/worldmonitor (Recommended)

**Steps**:
1. Copy all code from `worldmonitor-aff` → `worldmonitor` (new repo)
2. Update repo pointers in GitHub
3. Set Cloudflare Pages to build from Breaths-Live/worldmonitor main
4. Archive old repo (keep for reference)

**Timeline**: ~30 min (copy + push + test)

**Advantage**: Clean main repo as specified; old repo becomes reference only  
**Disadvantage**: Requires git history rewrite if needed

---

### Option B: Use Old Repo for Deployment (Quick Fix)

**Steps**:
1. Skip Breaths-Live/worldmonitor for now
2. Deploy tncsharetool/worldmonitor-aff to Cloudflare Pages directly
3. Plan migration for next sprint
4. Request repo rename/transfer later

**Timeline**: ~5 min (point Cloudflare to existing repo)

**Advantage**: Immediate deployment; no code changes  
**Disadvantage**: Contradicts new deployment plan; uses "old" repo

---

## Recommendation: Option A (Migrate)

Since user explicitly said "Dùng repo mới ... làm nguồn code chính", I recommend:

1. **Push worldmonitor-aff code to Breaths-Live/worldmonitor**
2. **Clean up**: Remove old TNC-Group/worldmonitor-aff from active use
3. **Deploy**: Configure Cloudflare to build from Breaths-Live/worldmonitor

### Solution Steps

```bash
# Step 1: In d:\AI-KILLS\worldmonitor (new empty repo)
cd d:\AI-KILLS\worldmonitor

# Step 2: Add old repo as remote
git remote add aff https://github.com/TNC-Group/worldmonitor-aff.git
git fetch aff

# Step 3: Merge aff/main → main
git merge aff/main --allow-unrelated-histories

# Step 4: Push to new repo
git push origin main

# Step 5: Verify
git log --oneline | head -5  # Should show aff's commits
```

**Risk**: Merges two unrelated histories, but clean git tree after

---

## Alternative: Cherry-pick or Copy Files

If merge seems risky, manually copy:

```bash
# Copy essentials from worldmonitor-aff
cp -r d:\AI-KILLS\worldmonitor-aff\src d:\AI-KILLS\worldmonitor\
cp -r d:\AI-KILLS\worldmonitor-aff\api d:\AI-KILLS\worldmonitor\
cp -r d:\AI-KILLS\worldmonitor-aff\public d:\AI-KILLS\worldmonitor\
cp -r d:\AI-KILLS\worldmonitor-aff\convex d:\AI-KILLS\worldmonitor\
cp d:\AI-KILLS\worldmonitor-aff\package.json d:\AI-KILLS\worldmonitor\
cp d:\AI-KILLS\worldmonitor-aff\vite.config.ts d:\AI-KILLS\worldmonitor\
cp d:\AI-KILLS\worldmonitor-aff\tsconfig.json d:\AI-KILLS\worldmonitor\
# ... copy all build/config files

# Then commit & push
cd d:\AI-KILLS\worldmonitor
git add .
git commit -m "Initial: migrate codebase from worldmonitor-aff"
git push origin main
```

---

## Next Action

**Victor should decide**:

- [ ] **Proceed with migration** (Option A) — I'll help execute
- [ ] **Use old repo for now** (Option B) — deploy immediately, migrate later
- [ ] **Ask owner** — confirm which repo is authoritative

Once decided → I'll complete **Step 2 (Verify Build)** → **Step 3 (Prepare ENV)** → full deployment to Cloudflare.

---

## Timeline Estimate

| Task | Duration |
|---|---|
| Decision | 5 min |
| Migration (merge or copy) | 10-20 min |
| Verify build locally | 5 min |
| Prepare env vars | 5 min |
| Cloudflare setup | 10-15 min |
| Test deployed app | 10 min |
| **Total** | **~1 hour** |

---

**Waiting on**: Victor's decision on repo strategy

Once confirmed, full deployment can proceed same day.
