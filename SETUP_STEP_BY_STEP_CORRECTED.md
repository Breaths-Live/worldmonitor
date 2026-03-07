# 🚀 API Setup - CORRECTED Full Guide (All 11 APIs)

**Thời gian tổng:** ~95 min | **Chi phí:** $0 | **Coverage:** ~92%

---

## 📊 API Priority List (Theo Thứ Tự Làm)

### ✅ Phase 1: CORE 5 APIs (50 min)
Bắt buộc. Làm trước.

| # | API | Thời gian | Link |
|---|-----|----------|------|
| 1 | GROQ | 5 min | https://console.groq.com/keys |
| 2 | FINNHUB | 5 min | https://finnhub.io/dashboard/api-keys |
| 3 | FRED | 10 min | https://fredaccount.stlouisfed.org/login/ |
| 4 | EIA | 10 min | https://www.eia.gov/opendata/register/ |
| 5 | ACLED | 10 min | https://acleddata.com/#/dashboard |

**Kết quả Phase 1:** ~50% dashboard | Markets ⚠️ | Economics ✅ | Conflicts ✅

---

### 🔴 Phase 2: HIGH PRIORITY 3 APIs (20 min)
Thêm để được 80% coverage. Giải quyết "35 findings".

| # | API | Thời gian | Link | Lý do |
|---|-----|----------|------|-------|
| 6 | OPENROUTER | 5 min | https://openrouter.ai/ | Fallback AI (critical!) |
| 7 | CLOUDFLARE | 5 min | https://www.cloudflare.com/ | Internet outage status |
| 8 | NASA FIRMS | 10 min | https://firms.modaps.eosdis.nasa.gov/ | Wildfire detection |

**Kết quả Phase 2:** ~80% dashboard | Markets ✅ | Fires ✅ | Intel ✅

---

### 🟠 Phase 3: REAL-TIME 3 APIs (20 min)
Tùy chọn. Để được 92% coverage.

| # | API | Thời gian | Link | Lý do |
|---|-----|----------|------|-------|
| 9 | AISSTREAM | 10 min | https://aisstream.io/ | Live ship tracking |
| 10 | OPENSKY | 5 min | https://opensky-network.org/ | Aircraft tracking |
| 11 | UPSTASH REDIS | 5 min | https://upstash.com/ | Cache layer |

**Kết quả Phase 3:** ~92% dashboard | Ships ✅ | Aviation ✅

---

## 🎯 TODAY'S TASK: Phase 1 + Phase 2 (70 min total)

Chi tiết để bạn làm **lần lượt từng cái**:

---

## ⏱️ STEP 1: GROQ (5 min)

### 1️⃣ Mở browser:
```
https://console.groq.com/keys
```

### 2️⃣ Sign up hoặc Login
- Nếu chưa có account → "Sign Up"
- Nhập email + password
- Verify email từ inbox

### 3️⃣ Tạo API Key
- Sau khi login → thấy "API Keys" section
- Click "Create New API Key"
- Copy key (dạng: `gsk_...`)
- **SAVE NÓ ĐỨA ĐÃY**

### 4️⃣ Thêm vào .env.local
```bash
# Mở file .env.local trong dự án
# Tìm dòng này:
GROQ_API_KEY=

# Thay bằng:
GROQ_API_KEY=gsk_YOUR_KEY_HERE_PASTE_HERE
```

✅ **GROQ DONE**

---

## ⏱️ STEP 2: FINNHUB (5 min)

### 1️⃣ Mở browser:
```
https://finnhub.io/dashboard/api-keys
```

### 2️⃣ Sign up hoặc Login
- Nếu chưa có → "Sign Up"
- Nhập email + password
- Verify email

### 3️⃣ Copy API Key
- Sau khi login → API key hiển thị ngay
- Copy (dạng: `ckxxx...`)
- **SAVE NÓ**

### 4️⃣ Thêm vào .env.local
```bash
# Tìm dòng:
FINNHUB_API_KEY=

# Thay bằng:
FINNHUB_API_KEY=ckXYZ123ABC...
```

✅ **FINNHUB DONE**

---

## ⏱️ STEP 3: FRED (10 min)

### 1️⃣ Mở browser:
```
https://fredaccount.stlouisfed.org/login/
```

### 2️⃣ Tạo account
- Click "Create Account"
- Nhập thông tin (First Name, Email, etc.)
- Password
- Bạn không cần xác minh email nặng

### 3️⃣ Vào API Keys
- Sau khi login → Dashboard
- Menu trái → "API Keys"
- Click "Create New API Key"
- Copy key

### 4️⃣ Thêm vào .env.local
```bash
# Tìm dòng:
FRED_API_KEY=

# Thay bằng:
FRED_API_KEY=YOUR_FRED_KEY_HERE
```

✅ **FRED DONE**

---

## ⏱️ STEP 4: EIA (10 min)

### 1️⃣ Mở browser:
```
https://www.eia.gov/opendata/register/
```

### 2️⃣ Điền form
- First Name
- Last Name  
- Email
- Organization: "Personal"
- Accept terms

### 3️⃣ Submit
- Bạn sẽ nhận API key qua email
- Hoặc thấy ngay trên dashboard
- Copy key

### 4️⃣ Thêm vào .env.local
```bash
# Tìm dòng:
EIA_API_KEY=

# Thay bằng:
EIA_API_KEY=YOUR_EIA_KEY_HERE
```

✅ **EIA DONE**

---

## ⏱️ STEP 5: ACLED (10 min)

### 1️⃣ Mở browser:
```
https://acleddata.com/#/dashboard
```

### 2️⃣ Sign up
- Click "Sign Up"
- Chọn "Researcher / Academic"
- Nhập email + password
- Verify email

### 3️⃣ Vào API section
- Dashboard → "API" (menu trái hoặc settings)
- Generate token
- Copy ACCESS TOKEN + NHỚ EMAIL CỦA BẠN

### 4️⃣ Thêm vào .env.local
```bash
# Tìm 2 dòng này:
ACLED_ACCESS_TOKEN=
ACLED_EMAIL=

# Thay bằng:
ACLED_ACCESS_TOKEN=YOUR_TOKEN_HERE
ACLED_EMAIL=your_email@gmail.com
```

✅ **ACLED DONE - Phase 1 Hoàn Thành! 🎉**

---

## ✅ Checkpoint: Before Moving Forward

Mở terminal và kiểm tra:

```bash
# Xem nếu .env.local có keys:
grep "GROQ_API_KEY" .env.local
grep "FINNHUB_API_KEY" .env.local
grep "FRED_API_KEY" .env.local
grep "EIA_API_KEY" .env.local
ACLED_ACCESS_TOKEN .env.local
ACLED_EMAIL .env.local

# Nên thấy OUTPUT không phải empty
# Ví dụ: GROQ_API_KEY=gsk_...
```

**Nếu tất cả 5 keys có → Tiếp tục Phase 2**

---

## 🔴 PHASE 2: (20 min more)

---

## ⏱️ STEP 6: OPENROUTER (5 min) ← Quan Trọng Nhất!

### "Tại sao quan trọng?"
- GROQ có giới hạn 14.4k requests/day
- Nếu hết → không có AI summaries
- OPENROUTER là fallback (Claude, Llama, Mistral)

### 1️⃣ Mở browser:
```
https://openrouter.ai/
```

### 2️⃣ Sign up
- Click "Sign up"
- GitHub hoặc email
- Confirm account

### 3️⃣ Copy API Key
- Dashboard → "API Key" (top right)
- Copy key (dạng: `sk-or-...`)
- **SAVE NÓ**

### 4️⃣ Thêm vào .env.local
```bash
# Tìm dòng:
OPENROUTER_API_KEY=

# Thay bằng:
OPENROUTER_API_KEY=sk-or-YOUR_KEY_HERE
```

✅ **OPENROUTER DONE - "35 Findings" Sẽ Hoạt Động!**

---

## ⏱️ STEP 7: CLOUDFLARE (5 min)

### "Tại sao?"
- Thêm internet outage detection panel
- Thêm CDN status

### 1️⃣ Mở browser:
```
https://www.cloudflare.com/
```

### 2️⃣ Sign up FREE
- Click "Sign Up"
- Email + password
- Verify email

### 3️⃣ Enable Radar API
- Sau khi login → Account → "Your Account"
- Down → "API Tokens"
- Create Token → "Radar token"
- Copy token

### 4️⃣ Thêm vào .env.local
```bash
# Tìm dòng:
CLOUDFLARE_API_TOKEN=

# Thay bằng:
CLOUDFLARE_API_TOKEN=YOUR_TOKEN_HERE
```

✅ **CLOUDFLARE DONE**

---

## ⏱️ STEP 8: NASA FIRMS (10 min)

### "Tại sao?"
- Wildfire detection từ satellite
- Real-time fire tracking

### 1️⃣ Mở browser:
```
https://firms.modaps.eosdis.nasa.gov/
```

### 2️⃣ Register
- Vào "Register" (top right hoặc login page)
- Nhập thông tin
- Nhớ confirm email

### 3️⃣ Tạo API Key
- Sau khi verify → Dashboard
- "Data Download" → "API"
- Generate token
- Copy API key

### 4️⃣ Thêm vào .env.local
```bash
# Tìm dòng:
NASA_FIRMS_API_KEY=

# Thay bằng:
NASA_FIRMS_API_KEY=YOUR_KEY_HERE
```

✅ **NASA FIRMS DONE - Phase 2 Hoàn Thành! 🎉**

---

## ✅ Checkpoint 2: Phase 1 + 2

```bash
# Kiểm tra tất cả 8 keys:
echo "=== CORE 5 ==="
grep "GROQ_API_KEY\|FINNHUB_API_KEY\|FRED_API_KEY\|EIA_API_KEY\|ACLED" .env.local

echo "=== HIGH PRIORITY 3 ==="
grep "OPENROUTER_API_KEY\|CLOUDFLARE_API_TOKEN\|NASA_FIRMS_API_KEY" .env.local

# Nên thấy 8 keys, không phải empty
```

---

## 🚀 Sau Khi Có 8 Keys: RESTART & VERIFY

### 1️⃣ Stop dev server
```bash
# Terminal running "npm run dev"
# Nhấn: Ctrl+C
```

### 2️⃣ Restart
```bash
npm run dev

# Wait for: ✨ VITE v6.0.7 ready in X ms
```

### 3️⃣ Test APIs
```bash
# Option A: Chạy verification script
node scripts/verify-apis.mjs

# Expected output:
# ✅ GROQ working
# ✅ FINNHUB working
# ✅ FRED working
# ✅ EIA working
# ✅ ACLED working
# ✅ OPENROUTER working
# ✅ CLOUDFLARE working
# ✅ NASA FIRMS working
```

### 4️⃣ Check Dashboard
```bash
# Mở browser
http://localhost:3000/

# Thấy:
# ✅ Stock prices (FINNHUB)
# ✅ GDP/unemployment (FRED)
# ✅ Oil prices (EIA)
# ✅ Conflict events (ACLED)
# ✅ AI summaries (GROQ/OPENROUTER)
# ✅ Internet status (CLOUDFLARE)
# ✅ Fire detection (NASA)
```

---

## 🟠 OPTIONAL: Phase 3 (3 APIs - 20 min)

Nếu muốn 92% coverage + live tracking:

### STEP 9: AISSTREAM (10 min)
```
https://aisstream.io/
Sign up → Generate key → Add to:
AISSTREAM_API_KEY=...
```

### STEP 10: OPENSKY (5 min)
```
https://opensky-network.org/
Sign up → OAuth keys → Add to:
OPENSKY_CLIENT_ID=...
OPENSKY_CLIENT_SECRET=...
```

### STEP 11: UPSTASH REDIS (5 min)
```
https://upstash.com/
Sign up → Create Redis → Add to:
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

---

## 📊 Final Coverage Scores

### Sau Phase 1 (5 keys):
```
Coverage: ~50%
Markets: 40% ⚠️
Economics: 95% ✅
Conflicts: 98% ✅
Intelligence: 50% ⚠️
```

### Sau Phase 2 (8 keys):
```
Coverage: ~80% 👍
Markets: 90% ✅
Economics: 98% ✅
Conflicts: 99% ✅ (max)
Intelligence: 98% ✅
Fires: 85% ✅
Internet: 90% ✅
Aviation: 50% ⚠️
Ships: 0% ❌
```

### Sau Phase 3 (11 keys):
```
Coverage: ~92% 🎉
EVERY PANEL: 95%+ ✅
Ships: 90% ✅
Aviation: 95% ✅
Everything: Fully Live
```

---

## ✨ Summary

**Bước tiếp theo của bạn:**

1. [ ] Register GROQ (5 min)
2. [ ] Register FINNHUB (5 min)
3. [ ] Register FRED (10 min)
4. [ ] Register EIA (10 min)
5. [ ] Register ACLED (10 min)
   **↓ Check all 5 working ↓**
6. [ ] Register OPENROUTER (5 min)
7. [ ] Register CLOUDFLARE (5 min)
8. [ ] Register NASA FIRMS (10 min)
   **↓ Restart dev server ↓**
9. [ ] Restart npm run dev
10. [ ] Run verification script
11. [ ] Check dashboard panels

**Total: ~95 min → 80% coverage (hoặc 92% nếu làm Phase 3)**

---

**Sẵn sàng bắt đầu?**

Đi tới: **https://console.groq.com/keys** (STEP 1)

Quay lại đây sau khi hoàn thành từng bước! ✅
