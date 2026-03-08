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
