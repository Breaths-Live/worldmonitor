# PR Checklist Template — for Victor & Lucky

Use this checklist in your PR description to ensure all aspects are covered before review.

---

## PR Description Template

Copy-paste into your PR body, fill in, submit.

```markdown
## Title
[Brief: e.g., "Add /api/trains endpoint for Lucky's Move tab"]

## Type of Change
- [ ] New feature (adds functionality)
- [ ] Bug fix (fixes an issue)
- [ ] Refactor (restructures code, no functional change)
- [ ] Documentation (docs/comments only)
- [ ] Chore (cleanup, deps, build config)

## Description
A brief paragraph explaining what & why.

### Motivation
Why is this change needed?

### Changes Made
- Bullet point 1
- Bullet point 2
- Bullet point 3

---

## Files Affected

| File | Reason | LOCK/UNLOCK |
|---|---|---|
| `api/trains.js` | New endpoint | N/A |
| `docs/API_MATRIX.md` | Docs update | UNLOCK ✅ |
| `src/config/travelPartners.ts` | Config update | N/A |

**Shared Files**: 
- [ ] None
- [ ] `docs/API_MATRIX.md` (LOCK started: [date], UNLOCK: [date])
- [ ] `src/config/variants.ts` (LOCK started: [date], UNLOCK: [date])
- [ ] Other: ____

---

## Testing

### Local Dev Testing

- [ ] Feature works as expected (describe what you tested)
  - Test scenario 1: [describe]
  - Test scenario 2: [describe]
  
- [ ] No console errors or warnings
  
- [ ] No visual regressions
  
- [ ] Responsive (mobile + desktop if UI changes)

### API Testing (if Victor)

- [ ] Endpoint responds with correct status codes (200, 400, 403, 503)
  - Test URL: `http://localhost:3000/api/trains?from=NYC&to=...`
  - Expected response: `{ "routes": [...] }`
  
- [ ] Rate limiting works (if applicable)
  
- [ ] CORS headers present (if applicable)
  
- [ ] Cache-Control headers set (if applicable)
  
- [ ] Relay fallback works (if relay-backed)

### UI Testing (if Lucky)

- [ ] New component renders without errors
  - Test variant: `?variant=travel`
  - Test page: Move tab
  
- [ ] Clicks work (CTAs, links)
  
- [ ] Affiliate SubIDs are valid
  - Example SubID: `move_NYC_3d_1`
  
- [ ] Links redirect correctly (no 404)

---

## Documentation

- [ ] Updated `docs/API_MATRIX.md` (if endpoint changed)
  
- [ ] Updated `docs/PANEL_DATA_MAP.md` (if data source changed)
  
- [ ] Updated `.agen/skills/WORLDMONITOR/SKILL.md` (if architecture changed)
  
- [ ] Code comments added (complex logic)
  
- [ ] Function docstrings updated (API functions)

---

## Env Variables & Secrets

- [ ] No hardcoded API keys or secrets in code
  
- [ ] New env vars documented in `affiliate-ids.md` or `API_MATRIX.md`
  
- [ ] Example values provided (or template in `.env.local.example`)
  
- [ ] Placeholder used in code: `process.env.MY_VAR || 'PLACEHOLDER'`

---

## LOCK / UNLOCK Status

If modified shared file(s):

- [ ] LOCK declared before changes (GitHub issue / Slack #dev-teamchat)
  
- [ ] UNLOCK declared in this PR body:
  ```
  **UNLOCK – src/config/...: [reason], ready for review.**
  Duration: [estimate]
  Tested: [test summary]
  ```

---

## Risk Statement

Assess risk of this change:

- **Risk Level**: 🟢 Low / 🟡 Medium / 🔴 High
  
- **Why**: [explanation]
  
- **Mitigation**: [how to mitigate risk, if any]

### Example:
- Risk: 🟡 Medium — changes variant.ts (shared config).
- Why: Might affect Lucky's UI if loading logic breaks.
- Mitigation: Tested all 4 variants locally, confirmed render times < 200ms.

---

## Checklist (QA)

- [ ] Follows project code style (ESLint, Prettier)
  
- [ ] No unused imports or variables
  
- [ ] No console.log or debug code left behind
  
- [ ] Commit messages are clear & descriptive
  
- [ ] Branch name follows convention: `feature/...` or `fix/...`
  
- [ ] No WIP commits (squash or reword before submission)

---

## Related Issues / PRs

- Closes #[issue number] (if applicable)
  
- Depends on #[PR number] (if applicable)
  
- Related to #[issue number] (if applicable)

---

## Reviewer Notes

Add any notes for the reviewer:
- Known limitations
- Areas needing extra scrutiny
- Follow-up tasks or future improvements

---

## Sign-Off

- [ ] I have tested these changes locally.
  
- [ ] I have updated relevant documentation.
  
- [ ] I have followed the LOCK/UNLOCK protocol (if shared files).
  
- [ ] This change follows the architecture defined in `.agen/skills/`.

**Developer**: [Your name]  
**Date**: [YYYY-MM-DD]

---
```

---

## Minimum Viable Checklist (Quick PR)

If you're in a rush, minimum items to check:

```markdown
## Quick Checklist

- [ ] What changed and why (1-2 sentences)
- [ ] Local dev test: [pass/fail]
- [ ] No console errors: [yes/no]
- [ ] Files changed: [list]
- [ ] LOCK/UNLOCK status (if shared): [declared/N/A]
- [ ] Risk level: [Low/Medium/High]
```

---

## Common PR Patterns

### Victor: New API Endpoint

```markdown
##  Add /api/[endpoint] — [description]

### Changes
- Added `api/[endpoint].js` with GET method
- Env var `[VAR_NAME]` required (set in Worker settings)
- Response format: JSON `{ ... }`

### Testing
- ✅ Tested locally: curl http://localhost:3000/api/[endpoint]
- ✅ Returns 200 for valid request
- ✅ Returns 503 if relay unavailable

### Docs Updated
- [x] API_MATRIX.md — added entry
- [x] PANEL_DATA_MAP.md — linked to [Panel Name]

### Files
| File | Change |
|---|---|
| api/[endpoint].js | New endpoint |
| docs/API_MATRIX.md | Documented |
```

### Lucky: New UI Component or Panel

```markdown
## Redesign AffCard for [Panel Name]

### Changes
- Updated `AffCardGrid` layout to 3 cols on desktop, 1 col mobile
- Added affiliate SubID tracking: `[block]_${destination}_${duration}_${position}`
- Added CTA validation (no empty links)

### Testing
- ✅ Previewed on Desktop (Chrome 120)
- ✅ Previewed on Mobile (iPhone 14, Samsung S24)
- ✅ All 3 affiliate partners render (booking, getyourguide, airalo)
- ✅ Links have correct SubIDs: `hero_PARIS3d_1`, `side_PARIS3d_2`, etc.

### Files
| File | Change |
|---|---|
| src/features/affiliate/components/AffCard.tsx | Redesigned grid |
| src/features/affiliate/config/affiliate-ids.md | Updated SubID examples |

### No Shared Files Affected
- [x] standalone UI change
```

---

## When Reviewer Approves

Once approved & merged:

✅ Close related issues (if any).

✅ Announce in #dev-teamchat (e.g., "/api/trains now live — Lucky can build Move tab feature").

✅ Update shared docs (API_MATRIX, PANEL_DATA_MAP) if needed.

---

**Last updated**: 2026-03-07 (Victor agent)  
**Related docs**:
- `docs/dev/LOCK_UNLOCK_PROTOCOL.md` — shared file coordination.
- `.agen/skills/WORLDMONITOR/SKILL.md` — architecture rules.
- `CONTRIBUTING.md` — general contribution guidelines.
