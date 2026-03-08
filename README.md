# worldmonitor-aff

## Frontend domains using the same backend

The following web apps share the **same API backend and data sources**:

- https://app.breaths.live
- https://worldmonitor.victorchuyen.net
- https://breaths.me

When updating backend code, CORS rules, or environment variables,
always test all three URLs to ensure they work correctly.

### CORS / API notes

- Backend must allow these origins:
  - `https://app.breaths.live`
  - `https://worldmonitor.victorchuyen.net`
  - `https://breaths.me`
- Or use a same-domain `/api/*` proxy on each site that forwards requests
  to the shared backend.

## Upstream Reference (Original App)

> **Luôn tham chiếu upstream để học và cập nhật tính năng mới!**

| Mục | Link |
|---|---|
| **App gốc (live)** | https://www.worldmonitor.app/ |
| **Repo gốc** | https://github.com/koala73/worldmonitor |

Khi upstream có update mới → so sánh diff và merge feature phù hợp vào repo này.

```powershell
# Thêm upstream remote (chỉ lần đầu)
git remote add upstream https://github.com/koala73/worldmonitor.git

# Fetch & xem thay đổi mới từ upstream
git fetch upstream
git log upstream/main --oneline -10

# So sánh file cụ thể
git diff main upstream/main -- src/services/runtime.ts
```
