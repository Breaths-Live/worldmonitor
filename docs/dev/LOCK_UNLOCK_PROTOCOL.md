# LOCK / UNLOCK Protocol — Shared File Coordination

## Mục tiêu

Tài liệu này định nghĩa quy trình để test tính an toàn khi hai developer (Victor, Lucky) cùng làm việc trên một file chung.

Khi thay đổi file `shared`, developer phải:
1. **LOCK** file trước khi sửa (báo team đang làm).
2. **Test** thay đổi cẩn thận.
3. **UNLOCK** khi hoàn thành & ready for review.

---

## Quy trình LOCK / UNLOCK

### Step 1: Declare LOCK

Khi bắt tay sửa file chung (ví dụ: `src/config/variants.ts`), tạo một PR **draft** hoặc comment trong issue/discussion:

```markdown
**LOCK – [file]: [Victor/Lucky] sửa [thời gian].**

File: `src/config/variants.ts`
Developer: Victor
Start time: 2026-03-07T10:30Z
Estimated duration: 2 hours
Reason: Refactor variant loading logic for affiliate integration.

Branch: feature/variant-refactor
```

**Đăng vào**: 
- GitHub Issue (attach label `🔒 locked`).
- Slack #dev-teamchat.
- PR description (if PR already open).

### Step 2: Implement & Test

- Commit changes dryly (keep commit messages descriptive).
- Test locally: `npm run dev`, visual regression, no errors.
- **Test scope**:
  - Your changes work in expected scenarios.
  - No unexpected side effects on other modules.
  - If file is shared, test both Victor use-case and Lucky use-case.

### Step 3: Declare UNLOCK

When changes are **READY FOR REVIEW** (tested, committed):

```markdown
**UNLOCK – [file]: done, ready for review.**

File: `src/config/variants.ts`
Duration: 2 hours (started 2026-03-07T10:30Z, ended 2026-03-07T12:30Z)
PR: #1234
Commits: abc1234, def5678, ghi9012

Tested:
- ✅ Local dev build + visual check.
- ✅ No console errors in browser.
- ✅ Variant switching works for World, Travel, Finance, Health.
- ✅ Affiliate config loads without errors.

Next: Ready for peer review by [other developer].
```

**Post in same location** (GitHub, Slack, PR).

---

## Shared Files List

These files are considered "shared" and require LOCK/UNLOCK discipline:

| File | Victor | Lucky | Status |
|---|---|---|---|
| `src/config/variants.ts` | ✅ | ✅ | Shared — env config & UI switches. |
| `src/config/affiliatePartners.ts` | ✅ | ✅ | Shared — CTA placement & IDs. |
| `src/config/liveChannels.ts` | ✅ | ✅ | Shared — real-time data & UI layout. |
| `src/config/liveWebcams.ts` | ✅ | ✅ | Shared — camera feed config. |
| `src/app/layout.tsx` | 🔴 | ✅ | Lucky leads; Victor consults. |
| `src/components/header.tsx` | 🔴 | ✅ | Lucky leads; Victor consults. |
| `src/features/affiliate/components/AffCard.tsx` | 🔴 | ✅ | Lucky leads; Victor integrates links. |
| `docs/` | ✅ | ✅ | Shared — both update docs. |

**Legend**:
- ✅ Both can modify independently (coordinate via LOCK/UNLOCK).
- 🔴 One leads; other contributes or reviews only.

---

## Common LOCK/UNLOCK Scenarios

### Scenario 1: Victor updates API endpoint, affects `docs/API_MATRIX.md`

```markdown
LOCK – docs/API_MATRIX.md: Victor adding `/api/trains` endpoint.
Reason: New travel endpoint for Lucky's Move tab.
ETA: 1 hour.
```

Victor updates endpoint code, docs updated.

```markdown
UNLOCK – docs/API_MATRIX.md: Victor tests /api/trains works locally.
PR #1235 ready for review.
```

Lucky pulls PR and updates corresponding UI code with confidence.

### Scenario 2: Lucky updates affiliate card UI, touches `src/config/affiliatePartners.ts`

```markdown
LOCK – src/config/affiliatePartners.ts: Lucky redesigning AffCard grid.
Reason: Responsive layout + new CTA positions for mobile.
ETA: 3 hours.
```

Lucky tests on mobile, ensures affiliate links still work.

```markdown
UNLOCK – src/config/affiliatePartners.ts: Ready. Grid tested on mobile & desktop.
PR #1236 includes affiliate position updates.
```

Victor reviews, updates affiliate ID injections if needed.

### Scenario 3: Both need same file simultaneously

If both try to LOCK same file:

1. **First declares LOCK** — owns the file temporarily.
2. **Second waits** or coordinates over Slack:
   - "Victor, can you do your variant changes by 3 PM? I need to update affiliate config by 4 PM."
   - Victor confirms: "Yes, UNLOCK by 3 PM."
3. After Victor UNLOCKs, Lucky LOCKs & proceeds.

**Avoid merge conflicts**: don't work on same file simultaneously unless coordinated in real-time.

---

## Checklist for PR Review (with LOCK/UNLOCK)

When reviewer sees UNLOCK, check:

- [ ] Developer declared LOCK before changes.
- [ ] Changes are focused (not gold-plating unrelated code).
- [ ] Developer tested in own local environment (confirmed in UNLOCK message).
- [ ] No console errors or warnings in test environment.
- [ ] If shared file, both Victor & Lucky scenarios covered in test notes.
- [ ] Updated docs (if API changes) or comments (if logic changes).
- [ ] Commit messages are clear & descriptive.

Example review comment:
```markdown
✅ Approve. LOCK/UNLOCK protocol followed, tests noted. No issues found.
Merging to `main` now.
```

---

## What NOT To Do

❌ **Don't LOCK without declaring in team**. 
- Other dev might also start editing, leading to merge conflicts.

❌ **Don't leave file LOCKED for days**. 
- Use reasonable turnaround (< 8 hours for most changes).
- If longer project, break into smaller LOCKs.

❌ **Don't skip test step**.
- Untested changes cause regressions.

❌ **Don't forget to UNLOCK**.
- Even if not merged, declare intent (push branch but declare UNLOCK so team knows).

---

## Automation (Future)

Consider GitHub label auto-assignment:
- PR created with `src/config/` changes → auto-label 🔒 `locked`.
- Requires approval from both Victor + Lucky before merge.
- CI blocks merge if LOCK/UNLOCK comments not found in PR body.

---

## Emergency Override

If developer is unavailable and file is urgently needed:
1. Try to contact them (Slack, email, call).
2. If unreachable, post in #dev-teamchat: "EMERGENCY UNLOCK REQUEST: [file] by [developer]. Awaiting response for [reason]."
3. Wait 30 min for response.
4. If no response, team lead (Trần Ngọc Chuyền) can authorize override.
5. Document override in PR with note: "@[developer] I unlocked your lock on [file] for [reason]. Please review changes."

---

## Summary

**LOCK** → **IMPLEMENT & TEST** → **UNLOCK → REVIEW & MERGE**

This keeps the team aligned and prevents regressions.

---

**Last updated**: 2026-03-07 (Victor agent)  
**Owner**: Victor & team  
**Related docs**:
- `CONTRIBUTING.md` — general contribution rules.
- `docs/dev/` — development guides.
