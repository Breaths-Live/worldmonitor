WS_RELAY_URL=https://worldmonitor-relay.fly.dev
VITE_WS_RELAY_URL=wss://worldmonitor-relay.fly.dev# 🚀 Deploy World Monitor Relay to Fly.io

## Quick Start (5 minutes)

### **Step 1: Install Fly CLI**

**Windows (PowerShell):**
```powershell
scoop install flyctl
```

**Or download:** https://fly.io/docs/hands-on/install-flyctl/

**Verify:**
```bash
fly version
```

---

### **Step 2: Create Fly.io Account**

Visit: https://fly.io/app/sign-up

- Sign up (free)
- Verify email
- Create organization

---

### **Step 3: Authenticate with Fly**

```bash
fly auth login
```

This opens browser → login → returns token

---

### **Step 4: Deploy Relay**

**Option A: Automatic Deployment (Recommended)**

```powershell
.\scripts\deploy-flyio.ps1
```

This will:
- ✅ Check Fly CLI
- ✅ Authenticate
- ✅ Create app
- ✅ Set secrets
- ✅ Deploy

**Option B: Manual Deployment**

```bash
# From project root
fly deploy

# View logs
fly logs

# Check status
fly status
```

---

### **Step 5: Update .env.local**

After deployment succeeds, Fly shows you the URL:

```
✅ https://worldmonitor-relay.fly.dev
```

Update `.env.local`:

```dotenv
WS_RELAY_URL=https://worldmonitor-relay.fly.dev
VITE_WS_RELAY_URL=wss://worldmonitor-relay.fly.dev
RELAY_SHARED_SECRET=$wm_relay_2024_secure_shared_secret_coachchuyen
```

---

## **Testing**

### Test Service Status
```bash
curl https://worldmonitor-relay.fly.dev/api/service-status
```

### Test AIS Data
```bash
curl https://worldmonitor-relay.fly.dev/api/ais-snapshot
```

### View Logs
```bash
fly logs -a worldmonitor-relay
```

### SSH into Server
```bash
fly ssh console -a worldmonitor-relay
```

---

## **Configuration**

### Environment Variables

Edit `fly.toml` to change:

```toml
[env]
  AISSTREAM_API_KEY = "your-key"
  OPENSKY_CLIENT_ID = "your-id"
  PORT = "8081"
  NODE_ENV = "production"
```

Then redeploy:
```bash
fly deploy
```

### Resources

Change CPU/Memory in `fly.toml`:

```toml
[[vm]]
  cpu_kind = "shared"  # or "performance"
  cpus = 1             # 1, 2, 4, or 8
  memory_mb = 256      # 256, 512, 1024, 2048
```

Fly.io free tier includes:
- 3 shared-cpu 1GB instances
- 160GB bandwidth/month
- 1 database

---

## **Troubleshooting**

### Deployment Failed
```bash
fly logs -a worldmonitor-relay
```

### App won't start
Check environment variables:
```bash
fly secrets list -a worldmonitor-relay
```

### Out of memory
Increase in `fly.toml`:
```toml
memory_mb = 512  # Increase from 256
fly deploy
```

### Custom domain
Add DNS record:
```bash
fly certs create relay.yourdomain.com
```

---

## **Cost**

**Free Tier:**
- $0/month (3 instances)

**If upgrading:**
- Paid instances: $0.01/hour (~$7-15/month)
- Egress: $0.02/GB after 160GB free

---

## **Next Steps**

1. ✅ Deploy relay
2. ✅ Update .env.local
3. ✅ Start dev server: `npm run dev`
4. ✅ See live maritime/aircraft data on http://localhost:3000

---

## **Videos & Docs**

- Deploy docs: https://fly.io/docs/
- Node.js guide: https://fly.io/docs/languages-and-frameworks/nodejs/
- CLI reference: https://fly.io/docs/flyctl/

---

**Questions? Check logs:**
```bash
fly logs -a worldmonitor-relay --follow
```
