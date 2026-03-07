# Final Checklist — Complete Deployment & Testing (Tasks 12–14)

## Overview

Sau 11 nhiệm vụ chuẩn bị, giờ đây team cần:
1. **Smoke test parity** — xác nhận tất cả services hoạt động rõ ràng.
2. **Kiểm thử skills** — xác nhận AI skills hoạt động trong VS Code Chat.
3. **Submit PRs** — đưa toàn bộ thay đổi vào repo chính.

---

## Task 12: Smoke Test Parity (Critical Panels)

Mục tiêu: Đảm bảo các panel chính hoạt động đúng trước khi merge.

### Setup Local Dev Environment

```bash
# 1. Copy env template
cp .env.local.template .env.local

# 2. Thêm ít nhất các keys bắt buộc vào .env.local:
#    - GROQ_API_KEY (hoặc OPENROUTER_API_KEY)
#    - FINNHUB_API_KEY
#    - EIA_API_KEY
#    - WS_RELAY_URL (nếu có relay staging)

# 3. Cài deps
npm install

# 4. Chạy dev server
npm run dev
```

### Test Scenarios

#### Scenario A: Map Layers (Victor scope)
- [ ] Open http://localhost:3000/?variant=world
- [ ] Verify left sidebar layers load:
  - [ ] Conflicts layer renders (red zones for instability)
  - [ ] Aviation layer shows flights (if opensky relay/API configured)
  - [ ] Maritime layer shows vessels (if AIS relay/API configured)
  - [ ] Jamming layer shows GPS jamming hotspots
- [ ] No console errors (F12 → Console)
- [ ] Cache headers visible: Safari DevTools / Chrome DevTools Network tab
  - Example: `Cache-Control: public, s-maxage=120`

#### Scenario B: News & Alerts Panels (Victor scope)
- [ ] Open same URL, check right sidebar:
  - [ ] Live News panel fetches & displays headlines
  - [ ] Alerts panel shows OREF/emergency alerts (if available in region)
  - [ ] Telegram Signals panel displays feed (if WS_RELAY_URL configured)
- [ ] Click on a news item → verify external link opens
- [ ] No rate limit errors (should see 200 responses in Network tab)

#### Scenario C: Travel Tab (Lucky scope)
- [ ] Open http://localhost:3000/?variant=travel&dest=paris&days=3
- [ ] Explore tab:
  - [ ] Loads destination info (Paris)
  - [ ] Shows trending experiences
  - [ ] Live webcams render (if configured)
- [ ] Stay tab:
  - [ ] Affiliate hotel cards display with "Book now" CTA
  - [ ] Click CTA → verify URL has SubID (e.g., `hero_PARIS3d_1`)
  - [ ] Link redirects to booking partner (with affiliate ID in URL)
- [ ] Do tab:
  - [ ] Experience cards show with GetYourGuide/Viator links
  - [ ] SubID tracking present
- [ ] Move tab:
  - [ ] Flight info loads (if opensky configured)
  - [ ] Transport options display

#### Scenario D: Finance Tab (Victor scope)
- [ ] Open http://localhost:3000/?variant=finance
- [ ] Prediction Markets panel:
  - [ ] Loads Polymarket markets (/api/polymarket?endpoint=markets)
  - [ ] Shows odds & event details
  - [ ] No CORS errors

#### Scenario E: Climate Tab (Victor scope)
- [ ] Open http://localhost:3000/?variant=climate
- [ ] Climate Data panel:
  - [ ] Loads EIA data (/api/eia/...)
  - [ ] Displays energy prices, capacity charts
  - [ ] No `EIA_API_KEY not configured` errors

### Common Issues & Fixes

| Issue | Cause | Fix |
|---|---|---|
| 404 on /api/opensky | WS_RELAY_URL not set | Set in .env.local, restart dev server |
| cors error on fetch | Domain not in whitelist | Check `_cors.js`, update if needed |
| blank news panel | rss-proxy failing | Test domain is whitelisted in rss-proxy.js |
| affiliate link missing SubID | Builder not called | Check affiliateLinks.ts, verify buildSubId() used |
| skills not loading in VS Code | .agen/skills/ path wrong | Verify .vscode/settings.json references correct path |

### Sign-Off

When all scenarios pass:

```markdown
✅ Smoke Test PASSED (2026-03-07)

Tested scenarios:
- [x] Map layers (conflicts, aviation, maritime, jamming)
- [x] News & alerts panels
- [x] Travel tab (explore, stay, do, move)
- [x] Finance tab (prediction markets)
- [x] Climate tab (EIA data)

No console errors observed.
All affiliate links have valid SubIDs.
API rate limits not exceeded.

Ready for merge.

— [Your name], 2026-03-07
```

---

## Task 13: Test Skills in Chat/Agent

Mục tiêu: Xác nhận mỗi skill cung cấp thông tin chính xác.

### Setup

1. **Reload VS Code extension** (Ctrl+Shift+P → "Reloading Extensions" or reload window).
2. **Open Copilot Chat** (Ctrl+Shift+I).
3. **Navigate to Skills/Agents panel** (if available).

### Test Each Skill

#### Test 1: WORLDMONITOR Skill

```
Query: "What are the responsibilities of Victor according to the WORLDMONITOR skill?"
Expected response: Mentions API, backend, env config, parity, docs updates.
```

Verify:
- [ ] Response mentions `/api/`, `/convex/`, `/src/services/`, `/src/config/`.
- [ ] States Victor responsibility: data, API, config, deploy, Cloudflare.
- [ ] Mentions LOCK/UNLOCK protocol for shared files.

#### Test 2: AFFILIATE Skill

```
Query: "Explain the SubID format for affiliate tracking."
Expected response: Describes {block}_{destination}{duration}_{position} format.
```

Verify:
- [ ] Provides correct format with examples (e.g., `hero_PARIS3d_1`).
- [ ] Explains each component (block, destination, duration, position).
- [ ] Mentions affiliate partners & no hard-coded secrets rule.

#### Test 3: LUCKY Skill

```
Query: "What is Lucky's role and what files does Lucky work on?"
Expected response: UI engineer, UX-first design, affiliate integration, specific file paths.
```

Verify:
- [ ] Identifies Lucky as UX/UI engineer.
- [ ] Lists files: `/src/features/*`, `/src/components/*`, `/docs/*`.
- [ ] Mentions Victor collaboration (no API changes alone).

#### Test 4: LUCKY_UX Skill

```
Query: "Describe the DestinationPage structure and CTA rules."
Expected response: Hero, quick actions, highlights, hotels, itinerary, experiences, prep, resources, footer.
```

Verify:
- [ ] Lists page sections in correct order.
- [ ] Mentions CTA height ≥ 48px, max 20–25 CTAs per page.
- [ ] References affiliate cards & blog links.

#### Test 5: api-helper Skill

```
Query: "How do I get a curl example for the /api/og-story endpoint?"
Expected response: Should provide endpoint summary, method, params, example curl command.
```

Verify:
- [ ] Endpoint method is GET.
- [ ] Params: `c`, `t`, `s`, `l` listed.
- [ ] Returns SVG image (1200x630 OG image).

### Sign-Off

When all 5 skills respond correctly:

```markdown
✅ Skills Testing PASSED (2026-03-07)

Tested skills:
- [x] WORLDMONITOR — explains architecture, Victor role, API structure.
- [x] AFFILIATE — correctly describes SubID format & partner rules.
- [x] LUCKY — identifies UX engineer role & file scope.
- [x] LUCKY_UX — describes DestinationPage & CTA rules.
- [x] api-helper — provides endpoint summaries & examples.

All responses accurate and matched expected content.

— [Your name], 2026-03-07
```

---

## Task 14: Submit PR(s)

Mục tiêu: Đưa tất cả thay đổi vào repo chính với LOCK/UNLOCK protocol & test confirmation.

### Prepare PR Commits

```bash
# 1. Create feature branch
git checkout -b feature/skills-and-docs

# 2. Stage files (review carefully):
git add .agen/skills/**/*.md
git add docs/API_MATRIX.md
git add docs/PANEL_DATA_MAP.md
git add docs/dev/victor-api-endpoints.md
git add docs/dev/LOCK_UNLOCK_PROTOCOL.md
git add docs/dev/PR_CHECKLIST.md
git add docs/dev/SKILLS_IMPORT.md
git add src/features/affiliate/config/affiliate-ids.md
git add .env.example
git add .env.local.template

# 3. Verify changes:
git status
git diff --cached (review each hunk)
```

### Create PR

```bash
# 4. Commit with clear message
git commit -m "feat: add AI skills (WORLDMONITOR, AFFILIATE, LUCKY) and team documentation

- Add .agen/skills/ with 5 new skills for Victor, Lucky, and team
- WORLDMONITOR skill: architecture, API, responsibilities
- AFFILIATE skill: monetization rules, SubID format, affiliate partners
- LUCKY skill: UX engineer role and file scope
- LUCKY_UX skill: DestinationPage, tab structure, CTA rules
- api-helper skill: quick API reference
- Add docs/API_MATRIX.md: complete endpoint & env var list (11 endpoints)
- Add docs/PANEL_DATA_MAP.md: panel-to-API data source mapping
- Add docs/dev/LOCK_UNLOCK_PROTOCOL.md: shared file coordination
- Add docs/dev/PR_CHECKLIST.md: PR template for Victor & Lucky
- Add docs/dev/SKILLS_IMPORT.md: VS Code setup guide
- Update .env.example & .env.local.template: add affiliate env vars
- Add src/features/affiliate/config/affiliate-ids.md: affiliate setup guide

LOCK/UNLOCK Status:
- docs/ files: Updated by Victor, ready for review
- .agen/skills/: All files new, no conflicts
- .env.*: Minimal changes, backward compatible

Tested:
- ✅ Smoke test: Maps, news, travel, finance, climate panels all functional
- ✅ Skills test: All 5 skills respond correctly to demo queries
- ✅ Affiliate config: SubID format validated, example links working
- ✅ No console errors in dev environment

Closes #[issue-number] (if applicable)"

# 5. Push to GitHub
git push origin feature/skills-and-docs
```

### Create PR on GitHub

1. Go to https://github.com/tncsharetool/worldmonitor-aff/pulls
2. Click "New Pull Request"
3. Select `feature/skills-and-docs` as source branch
4. Fill PR description (copy from commit message or use PR_CHECKLIST template):

```markdown
## Title
[✨ Add AI Skills & Team Documentation] — Victor, Lucky, Affiliate, WorldMonitor

## Description

This PR adds comprehensive AI skills (5 new `.agen/skills/` modules) and supporting documentation to streamline team development and monetization workflow.

## Files Affected

| File | Change |
|---|---|
| `.agen/skills/WORLDMONITOR/SKILL.md` | New — architecture reference |
| `.agen/skills/AFFILIATE/AFFILIATE_SKILL.md` | New — monetization rules |
| `.agen/skills/LUCKY/LUCKY_SKILL.md` | New — UX engineer scope |
| `.agen/skills/LUCKY_UX/LUCKY_UX_SKILL.md` | New — DestinationPage guide |
| `.agen/skills/api-helper/SKILL.md` | New — API helpers |
| `docs/API_MATRIX.md` | New — endpoint documentation |
| `docs/PANEL_DATA_MAP.md` | New — panel-data mapping |
| `docs/dev/*` | New — team protocols & guides |
| `.env.example` | Updated — added affiliate vars |
| `.env.local.template` | Updated — added affiliate tier |

## Type of Change
- [x] New feature (skills & docs)
- [ ] Bug fix
- [ ] Refactor

## Shared Files
None modified from production code; only docs & config.

## Testing

### Local Dev Test (Smoke Test)
- [x] `npm run dev` — starts without errors
- [x] Tested variant=world: Map layers (conflicts, aviation, jamming) all render
- [x] Tested variant=travel: Explore, Stay, Do, Move tabs functional
- [x] Tested variant=finance: Prediction markets load (if FINNHUB_API_KEY set)
- [x] Tested variant=climate: EIA data loads (if EIA_API_KEY set)
- [x] All affiliate links have valid SubIDs (e.g., `hero_PARIS3d_1`)
- [x] No console errors observed

### Skills Test (Copilot Chat)
- [x] WORLDMONITOR skill: correctly explains Victor responsibilities
- [x] AFFILIATE skill: correctly describes SubID format
- [x] LUCKY skill: correctly identifies UX engineer role
- [x] LUCKY_UX skill: correctly explains DestinationPage structure
- [x] api-helper skill: provides correct endpoint info

## Documentation Updated
- [x] API_MATRIX.md — all 11 endpoints documented
- [x] PANEL_DATA_MAP.md — data sources mapped to panels
- [x] SKILLS_IMPORT.md — VS Code setup guide
- [x] LOCK_UNLOCK_PROTOCOL.md — shared file coordination
- [x] PR_CHECKLIST.md — template for future PRs
- [x] .env.example — added affiliate variables
- [x] .env.local.template — organized by tier

## LOCK / UNLOCK Status

No shared production code modified. Only docs & config:
```
UNLOCK – docs/: Victor completed documentation tasks
- Duration: ~4 hours (research + documentation)
- Tested: ✅ All smoke tests passed
- Ready: ✅ Ready for Lucky review of UX sections
```

## Risk Assessment
🟢 **Low Risk**
- Only adds documentation & new skill files
- No changes to production API or UI components
- Affiliate env vars optional (backward compatible)
- No breaking changes

## Related Issues/PRs
- Closes #[task-code] (if applicable)
- Depends on: none

## Checklist

- [x] Code follows style guidelines (Markdown format, clear structure)
- [x] No hard-coded secrets
- [x] Documentation is clear & complete
- [x] No console errors or warnings when tested
- [x] Followed LOCK/UNLOCK protocol
- [x] Updated .env files for new variables

---

**Sign-off by Victor**: Ready for review by Lucky (UX sections) and team lead.
```

### Address Review Comments

Team members (Lucky, Trần Ngọc Chuyền) will review:
- [ ] Skills content accuracy
- [ ] Documentation clarity
- [ ] Affiliate config completeness
- [ ] No security issues

Make commits to address feedback:

```bash
git commit -m "fix: address review comments on LUCKY_UX skill

- Clarified CTA height rule (48px minimum)
- Added example SubID for each section
- Updated affiliate card grid layout description
"

git push origin feature/skills-and-docs
```

### Merge to Main

Once approved:

```bash
# 1. Merge (GitHub UI or CLI)
git checkout main
git pull origin main
git merge --squash origin/feature/skills-and-docs
git commit -m "merge: skills and team documentation (feature/skills-and-docs)"
git push origin main

# 2. Delete feature branch
git push origin --delete feature/skills-and-docs
git branch -d feature/skills-and-docs
```

### Post-Merge Announcement

Post in #dev-teamchat:

```
🎉 Skills & Documentation PR merged!

New additions:
✅ 5 AI skills in `.agen/skills/` — WORLDMONITOR, AFFILIATE, LUCKY, LUCKY_UX, api-helper
✅ Comprehensive API documentation (API_MATRIX.md, PANEL_DATA_MAP.md)
✅ Team protocols: LOCK/UNLOCK, PR Checklist, Skills Import guide
✅ Affiliate env vars & setup guide

How to start using:
1. Pull latest: git pull origin main
2. Reload VS Code: Ctrl+Shift+P → Reload Window
3. Open Copilot Chat: Ctrl+Shift+I
4. Select WORLDMONITOR skill → ask questions about architecture

Learn more: docs/dev/SKILLS_IMPORT.md

Victor & Lucky: let's start using these skills in our daily chat!
```

---

## Summary

✅ Tasks 12–14 complete → Team ready to productively develop!

**Outcomes**:
1. ✅ Smoke test validates all services work.
2. ✅ Skills test validates AI guidance is accurate.
3. ✅ PR merge gets everything into the repo for team access.

**Next steps for Victor & Lucky**:
- Use skills daily in Copilot Chat
- Refer to docs when implementing features
- Update skills/docs as architecture evolves

---

**Created**: 2026-03-07  
**For**: Victor, Lucky, Team  
**Reference**: `.agen/skills/`, `docs/API_MATRIX.md`, `docs/PANEL_DATA_MAP.md`, `docs/dev/`
