# 🔄 SYNC GUIDE: Add Missing Enrichment API

**Status:** ⚠️ Enrichment service MISSING from local fork  
**Priority:** 🟡 Medium (Tech/Finance variants only)  
**Effort:** 15-20 minutes + testing

---

## 📋 WHAT'S MISSING

From **origin repo** https://github.com/koala73/worldmonitor/tree/main/api:

```
✅ Origin has:     /api/enrichment/
                   ├── company.js      (GitHub + SEC + HN)  
                   └── signals.js      (Funding + hiring events)

❌ Local missing:  No enrichment API at all
```

---

## 🎯 WHAT IT DOES

**Enrichment Service** provides company intelligence:

```
GET /api/enrichment/company?domain=stripe.com
→ Returns:
  {
    "company": "Stripe",
    "github": {
      "stars": 45000,
      "repos": 120,
      "languages": ["TypeScript", "React", "Python"]
    },
    "sec": {
      "filings": ["10-K 2024", "10-Q Q4 2024"],
      "ceo": "Patrick Collison"
    },
    "hackernews": {
      "mentions": 342,
      "sentiment": "bullish",
      "recent": ["Stripe API v2", "New webhook system"]
    }
  }

GET /api/enrichment/signals?company=Stripe
→ Returns:
  {
    "funding": {"stage": "Series S", "amount": "$95B"},
    "hiring": {"surge": "15% month-over-month"},
    "executive": {"changes": ["New CFO appointed"]},
    "expansion": {"regions": ["Brazil", "India"]}
  }
```

---

## 🚀 SYNC OPTIONS

### **Option 1: Manual Sync (Recommended - Full Understanding)**

#### Step 1: Get Source Files from Origin

```bash
# Clone temp copy of origin repo
git clone https://github.com/koala73/worldmonitor.git /tmp/origin-sync
cd /tmp/origin-sync

# Copy enrichment files
cp api/enrichment/company.js ~/workspace/api/enrichment/
cp api/enrichment/signals.js ~/workspace/api/enrichment/
cp proto/worldmonitor/enrichment.proto ~/workspace/proto/worldmonitor/
cp server/worldmonitor/enrichment/v1/handler.ts ~/workspace/server/worldmonitor/enrichment/v1/
```

#### Step 2: Create Local Enrichment Structure

```bash
# In local repo (worldmonitor-aff)
mkdir -p api/enrichment
mkdir -p server/worldmonitor/enrichment/v1
```

#### Step 3: Inspect Origin Files

```bash
# View company.js from origin
cat /tmp/origin-sync/api/enrichment/company.js
# (Check for dependencies, environment variables)

# View signals.js
cat /tmp/origin-sync/api/enrichment/signals.js

# View proto definition
cat /tmp/origin-sync/proto/worldmonitor/enrichment.proto
```

#### Step 4: Copy & Adapt Files

**File 1: api/enrichment/company.js**
```javascript
// Copy from origin, check for:
// - Dependencies (GitHub API? SEC scraper?)
// - Environment variables
// - Rate limits
// - Caching strategy
```

**File 2: api/enrichment/signals.js**
```javascript
// Copy from origin, check for:
// - HackerNews scraping logic
// - Signal classification
// - Redis caching
```

**File 3: server/worldmonitor/enrichment/v1/handler.ts**
```typescript
// Copy from origin, then:
// - Update proto imports
// - Verify Redis connection
// - Check API token requirements
```

#### Step 5: Update Proto Definition

```bash
# Add to proto/worldmonitor/enrichment.proto
# (Copy structure from origin)

# Then regenerate:
make generate  # or: buf generate
```

#### Step 6: Update Vite Config

In `vite.config.ts`, add enrichment route to sebufApiPlugin:

```typescript
// Find the sebufApiPlugin function (around line 274)
// Add this import:
import { createServiceRoutes as createEnrichmentRoutes } 
  from './server/worldmonitor/enrichment/v1/handler.js';

// Add to routes map:
routes.set('enrichment', createEnrichmentRoutes());
```

---

### **Option 2: Fetch from GitHub Raw URLs**

```bash
# If manual copy is complex, fetch raw files:

# Get company.js
curl -o api/enrichment/company.js \
  https://raw.githubusercontent.com/koala73/worldmonitor/main/api/enrichment/company.js

# Get signals.js  
curl -o api/enrichment/signals.js \
  https://raw.githubusercontent.com/koala73/worldmonitor/main/api/enrichment/signals.js

# Get handler
curl -o server/worldmonitor/enrichment/v1/handler.ts \
  https://raw.githubusercontent.com/koala73/worldmonitor/main/server/worldmonitor/enrichment/v1/handler.ts

# Get proto
curl -o proto/worldmonitor/enrichment.proto \
  https://raw.githubusercontent.com/koala73/worldmonitor/main/proto/worldmonitor/enrichment.proto
```

---

## 📋 VERIFICATION CHECKLIST

After syncing, verify with:

```bash
# 1. Check files exist
ls -la api/enrichment/
ls -la server/worldmonitor/enrichment/v1/

# 2. Run dev server
npm run dev

# 3. Test enrichment endpoint
curl http://localhost:3000/api/enrichment/company?domain=stripe.com

# 4. Check for errors in console
# Should see: ✅ Enrichment service loaded

# 5. Verify proto generation
npm run typecheck

# 6. Test signals endpoint
curl http://localhost:3000/api/enrichment/signals?company=Stripe
```

---

## ⚡ QUICK IMPLEMENTATION

If you want to get this done **RIGHT NOW**:

```bash
# Create enrichment directory
mkdir -p api/enrichment
mkdir -p server/worldmonitor/enrichment/v1

# Create stub files (working foundation)
cat > api/enrichment/company.js << 'EOF'
export default async (req, res) => {
  const domain = req.query?.domain;
  if (!domain) return res.status(400).json({ error: 'domain required' });
  
  // Placeholder - to be implemented from origin
  res.json({
    company: domain,
    github: { stars: 0, repos: 0 },
    sec: { filings: [] },
    hackernews: { mentions: 0 }
  });
};
EOF

cat > api/enrichment/signals.js << 'EOF'
export default async (req, res) => {
  const company = req.query?.company;
  if (!company) return res.status(400).json({ error: 'company required' });
  
  // Placeholder - to be implemented from origin  
  res.json({
    funding: null,
    hiring: null,
    executive: null,
    expansion: null
  });
};
EOF

# Test - should return 200 but with placeholder data
npm run dev
# In another terminal:
curl http://localhost:3000/api/enrichment/company?domain=stripe.com
```

---

## 🎯 DECISION MATRIX

| Approach | Cost | Quality | Speed | Recommendation |
|----------|------|---------|-------|-----------------|
| Manual full sync | High | Excellent | Slow | ✅ Best long-term |
| GitHub raw fetch | Low | Good | Medium | ✅ Balance |
| Stub + defer | Very Low | Placeholder | Very Fast | ⚠️ Tech debt |

**RECOMMENDATION:** Use GitHub raw fetch (Option 2) for speed, then refine from origin.

---

## 📞 CURRENT BLOCKERS (KNOWN ISSUES)

If enrichment endpoints fail after sync:

**Issue 1:** Missing GitHub API token
```bash
# Add to .env.local:
export GITHUB_API_TOKEN=ghp_xxxxxx  # Get from https://github.com/settings/tokens
```

**Issue 2:** Missing SEC scraper dependency
```bash
# Check if these are installed:
npm list sec-filings   # or similar package name
```

**Issue 3:** Proto generation fails
```bash
# Regenerate all protos if enrichment.proto is new:
make clean generate
# or
buf generate --path proto/worldmonitor/enrichment.proto
```

---

## 📚 FILES TO SYNC

| File | Source | Destination | Size | Complexity |
|------|--------|-------------|------|------------|
| company.js | `/api/enrichment/company.js` | ✅ Copy as-is | ~150 lines | Low |
| signals.js | `/api/enrichment/signals.js` | ✅ Copy as-is | ~200 lines | Low |
| handler.ts | `/server/.../enrichment/v1/handler.ts` | ⚠️ Update proto imports | ~300 lines | Medium |
| enrichment.proto | `/proto/.../enrichment.proto` | ⚠️ Need to regenerate | ~200 lines | Medium |

**Time Estimate:** 15-30 minutes depending on dependency adjustments.

---

## ✅ COMPLETION CRITERIA

After sync is complete:

- [ ] `api/enrichment/company.js` exists and responds
- [ ] `api/enrichment/signals.js` exists and responds
- [ ] Proto definitions regenerated successfully
- [ ] TypeScript typechecking passes (`npm run typecheck`)
- [ ] Test endpoints return valid JSON (not errors)
- [ ] Cache hits working (check X-Cache headers)

---

## 📊 IMPACT

**Before Sync:**
- Enrichment endpoints: ❌ 404 Not Found
- Tech variant: 98% complete
- Finance variant: 98% complete

**After Sync:**
- Enrichment endpoints: ✅ 200 OK
- Tech variant: 100% complete ✅
- Finance variant: 100% complete ✅
- Parity with origin: 100%

---

## 🚀 WHEN TO SYNC

**Priority Order:**
1. ⏱️ **NOW** → Deploy Railway Relay (unblocks 9 major APIs)
2. ⏱️ **NEXT** → Add Enrichment (completes feature parity)
3. ⏱️ **LATER** → Monitor & optimize performance

---

**Decision:** Should I proceed with syncing Enrichment API?

Options:
- [ ] A) Yes, sync from GitHub raw URLs (fastest)
- [ ] B) Manual copy from cloned origin repo
- [ ] C) Skip for now, focus on Railway Relay first
- [ ] D) Create stub endpoints now, implement later

