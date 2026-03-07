# 🚀 API Setup Complete Guide - Step by Step

**Thời gian:** ~1 giờ | **Chi phí:** FREE | **Impact:** 85%+ features

---

## 📋 Danh Sách API Cần Setup

### ✨ Essential Tier (PHẢI SETUP)

| # | Service | URL | Time | Free Limit |
|---|---------|-----|------|-----------|
| 1 | **Groq** (AI) | https://console.groq.com/keys | 5 min | 14.4k/day |
| 2 | **Finnhub** (Markets) | https://finnhub.io/dashboard/api-keys | 5 min | 60/min |
| 3 | **FRED** (Economics) | https://fredaccount.stlouisfed.org/ | 10 min | Unlimited |
| 4 | **EIA** (Energy) | https://www.eia.gov/opendata/register/ | 10 min | Unlimited |
| 5 | **ACLED** (Geopolitics) | https://acleddata.com/#/dashboard | 10 min | ~5k/day |

**Total Time:** ~40 minutes

---

## 🎬 Step-by-Step: Lấy Từng API Key

### **1️⃣ Groq (AI Summaries)**

```
📍 https://console.groq.com/keys
⏱️  5 minutes
```

**Bước:**
1. Vào `https://console.groq.com/keys`
2. Nếu chưa có tài khoản → Click "Sign In" → "Create account"
3. Xác minh email
4. Tạo new API key
5. Copy key (dạng: `gsk_...`)

**Sử dụng:**
```bash
# Trong .env.local, tìm dòng:
GROQ_API_KEY=gsk_YOUR_KEY_HERE

# Thay bằng:
GROQ_API_KEY=gsk_abc123def456...
```

**Kích hoạt:**
- ✅ AI threat classification
- ✅ Headline summarization  
- ✅ Deduction panel
- ✅ World brief generation

---

### **2️⃣ Finnhub (Market Data)**

```
📍 https://finnhub.io/dashboard/api-keys
⏱️  5 minutes
```

**Bước:**
1. Vào `https://finnhub.io/dashboard/api-keys`
2. Click "Sign Up Free"
3. Đăng ký email/password
4. Xác minh email
5. Copy API key (dạng: `ckxxxxxxxxx`)

**Sử dụng:**
```bash
# Trong .env.local:
FINNHUB_API_KEY=YOUR_KEY_HERE

# Thay bằng:
FINNHUB_API_KEY=ckxxx...
```

**Kích hoạt:**
- ✅ Stock quotes (real-time)
- ✅ ETF flows
- ✅ Sector summaries
- ✅ Market panel

---

### **3️⃣ FRED (Economic Data)**

```
📍 https://fredaccount.stlouisfed.org/login/
⏱️  10 minutes
```

**Bước:**
1. Vào `https://fredaccount.stlouisfed.org/login/`
2. Click "Create Account"
3. Điền thông tin (không cần xác thực email nặng)
4. Sau khi login → My Dashboard → "API Keys"
5. Click "Create New API Key"
6. Copy key

**Sử dụng:**
```bash
# Trong .env.local:
FRED_API_KEY=YOUR_KEY_HERE

# Thay bằng:
FRED_API_KEY=abc123def456...
```

**Kích hoạt:**
- ✅ GDP, unemployment data
- ✅ Interest rates
- ✅ Macro signals
- ✅ Economic indicators

---

### **4️⃣ EIA (Energy Data)**

```
📍 https://www.eia.gov/opendata/register/
⏱️  10 minutes
```

**Bước:**
1. Vào `https://www.eia.gov/opendata/register/`
2. Điền form (First Name, Email, Organization - có thể để "Personal")
3. Accept terms
4. Submit
5. Copy API key từ email xác nhận hoặc dashboard

**Sử dụng:**
```bash
# Trong .env.local:
EIA_API_KEY=YOUR_KEY_HERE

# Thay bằng:
EIA_API_KEY=your-long-key-here
```

**Kích hoạt:**
- ✅ WTI/Brent crude prices
- ✅ US production data
- ✅ Inventory levels
- ✅ Energy analytics

---

### **5️⃣ ACLED (Geopolitical Data)**

```
📍 https://acleddata.com/#/dashboard
⏱️  10 minutes
```

**Bước:**
1. Vào `https://acleddata.com/#/dashboard`
2. Điền form đăng ký (chọn "Researcher/Academic")
3. Xác minh email
4. Login vào dashboard
5. Vào "API" section
6. Copy ACCESS TOKEN

**Sử dụng:**
```bash
# Trong .env.local, cần 2 fields:
ACLED_ACCESS_TOKEN=YOUR_TOKEN_HERE
ACLED_EMAIL=your_email@example.com

# Thay bằng:
ACLED_ACCESS_TOKEN=abc123...
ACLED_EMAIL=your.email@gmail.com
```

**Kích hoạt:**
- ✅ Protest tracking
- ✅ Conflict events
- ✅ Unrest monitoring
- ✅ Geopolitical data

---

## 🔧 Insert Keys vào .env.local

Sau khi lấy tất cả 5 keys, thêm vào file:

```bash
# Mở .env.local
nano .env.local

# Tìm các dòng này và thay YOUR_KEY_HERE:
GROQ_API_KEY=gsk_your_actual_key_here
FINNHUB_API_KEY=your_finnhub_key_here  
FRED_API_KEY=your_fred_key_here
EIA_API_KEY=your_eia_key_here
ACLED_ACCESS_TOKEN=your_token_here
ACLED_EMAIL=your_email@example.com

# Save: Ctrl+O → Enter → Ctrl+X
```

---

## ✅ Verify Keys Được Thêm Đúng

```bash
# Check nếu keys được set:
grep "GROQ_API_KEY" .env.local
grep "FINNHUB_API_KEY" .env.local
grep "FRED_API_KEY" .env.local
grep "EIA_API_KEY" .env.local
grep "ACLED_ACCESS_TOKEN" .env.local

# Nên thấy output như:
# GROQ_API_KEY=gsk_xxx...
# FINNHUB_API_KEY=xxx...
# etc.
```

---

## 🔄 Restart Dev Server

**Rất quan trọng:** Dev server phải restart để load .env.local

```bash
# Terminal đang chạy npm run dev
# 1. Nhấn: Ctrl+C (để stop)

# 2. Chạy lại:
npm run dev

# ✅ Nên thấy:
# VITE v6.0.7  ready in XXX ms
# ➜  local:   http://localhost:3000/
```

---

## 🧪 Test APIs Working

### Test 1: Market Data

```bash
curl "http://localhost:3000/api/market/v1/list-market-quotes?symbols=AAPL,MSFT,GOOGL"
```

**Nên trả về:**
```json
{
  "quotes": [
    {
      "symbol": "AAPL",
      "price": 195.23,
      "change": 2.5,
      "source": "finnhub"
    },
    ...
  ]
}
```

### Test 2: Economic Data

```bash
curl "http://localhost:3000/api/economic/v1/get-macro-signals"
```

**Nên trả về:**
```json
{
  "signals": {
    "liquidity": "bullish",
    "flow_structure": "aligned",
    "macro_regime": "risk_on",
    ...
  }
}
```

### Test 3: Geopolitical Events

```bash
curl "http://localhost:3000/api/conflict/v1/list-acled-events?country=US&limit=5"
```

**Nên trả về:**
```json
{
  "events": [
    {
      "event_id": "...",
      "event_date": "2026-03-04",
      "event_type": "Protests",
      "location": "...",
      "fatalities": 0
    },
    ...
  ]
}
```

---

## 🖥️ Verify trong Dashboard

Mở http://localhost:3000/ và kiểm tra các panels:

| Panel | Dấu Hiệu ✅ |
|-------|-----------|
| **Market** | Giá cổ phiếu hiển thị & cập nhật |
| **Intelligence** | Threat scores xuất hiện |
| **Economic** | GDP, unemployment data hiển thị |
| **Energy** | WTI/Brent prices xuất hiện |
| **Conflict** | ACLED events hiển thị |
| **World Brief** | AI summary được tạo |

---

## 🐛 Troubleshooting

### Problem: "API Key not set" trong logs

**Nguyên nhân:** .env.local không được load  
**Fix:**
```bash
# Kiểm tra file tồn tại:
ls -la .env.local

# Restart dev server:
npm run dev

# Clear terminal cache:
npm run dev -- --force
```

### Problem: "401/403 Unauthorized"

**Nguyên nhân:** API key sai hoặc hết quota  
**Fix:**
1. Kiểm tra key lại từ service (copy exact)
2. Restart dev server
3. Check free tier limits:
   - Groq: 14.4k/day
   - Finnhub: 60 req/min (unlikely to hit)
   - FRED: Unlimited
   - EIA: Unlimited

### Problem: Timeout errors

**Nguyên nhân:** API service chậm  
**Fix:** Bình thường, app fallback to cache. Chờ 1-2 phút

---

## 📊 Expected Result After Setup

| Feature | Before | After |
|---------|--------|-------|
| **News feeds** | ✅ | ✅ |
| **Map rendering** | ✅ | ✅ |
| **Stock quotes** | ❌ | ✅ |
| **AI summaries** | ❌ | ✅ |
| **Market signals** | ❌ | ✅ |
| **Economic data** | ❌ | ✅ |
| **Conflict events** | ❌ | ✅ |
| **Energy prices** | ❌ | ✅ |
| **Threat classification** | ⚠️ | ✅ |
| **Total Real-Time** | ~20% | **~85%** |

---

## 🎯 Summary Checklist

- [ ] Copy `.env.example` → `.env.local`
- [ ] Register Groq API key
- [ ] Register Finnhub API key
- [ ] Register FRED API key
- [ ] Register EIA API key
- [ ] Register ACLED credentials
- [ ] Add all 5 keys to `.env.local`
- [ ] Restart: `npm run dev`
- [ ] Test at least 2 endpoints (curl)
- [ ] Open http://localhost:3000/ and verify panels

---

## ⏱️ Time Breakdown

```
Register Groq:              5 min
Register Finnhub:           5 min
Register FRED:             10 min
Register EIA:              10 min
Register ACLED:            10 min
─────────────────────────────────
Total Registration:        40 min

Add keys to .env.local:     5 min
Restart dev server:         2 min
Test endpoints:             5 min
─────────────────────────────────
Total Setup:            ~50 minutes
```

---

## 🎉 Next: Desktop App (Optional)

Sau khi local app hoạt động, thử desktop:

```bash
npm run desktop:dev           # Start Tauri dev
npm run desktop:package:windows:full  # Build EXE
```

---

**Generated:** Setup Complete Guide  
**Status:** ✅ Ready to Execute  
**Questions?** Check `API_INTEGRATION_STATUS.md` in project root
