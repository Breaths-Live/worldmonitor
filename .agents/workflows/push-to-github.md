---
description: Push code lên GitHub qua SSH (Breaths-Live/worldmonitor)
---

# Push Code lên GitHub (SSH)

## Thông tin cố định

| Mục | Giá trị |
|---|---|
| **Repo GitHub** | `git@github.com:Breaths-Live/worldmonitor.git` |
| **Thư mục local** | `D:\AI-KILLS\worldmonitor-aff` |
| **Nhánh** | `main` |
| **SSH Key** | `~/.ssh/id_ed25519` (email: `tnc.mmo9@gmail.com`) |
| **Giao thức** | SSH ✅ (HTTPS bị 403 — không dùng) |

---

## Push hàng ngày (3 lệnh)

```powershell
cd "D:\AI-KILLS\worldmonitor-aff"
git add .
git commit -m "mô tả thay đổi"
git push origin main
```

---

## Kiểm tra nhanh nếu gặp lỗi

### Lỗi: remote sai URL

```powershell
git remote -v
```

Nếu KHÔNG thấy `git@github.com:Breaths-Live/worldmonitor.git`, sửa lại:

```powershell
git remote set-url origin git@github.com:Breaths-Live/worldmonitor.git
```

### Lỗi: SSH không xác thực

```powershell
ssh -T git@github.com
```

Phải thấy: `Hi Breaths-Live! You've successfully authenticated...`

Nếu không → kiểm tra key:

```powershell
type $env:USERPROFILE\.ssh\id_ed25519.pub
```

Nếu key mất → tạo lại:

```powershell
ssh-keygen -t ed25519 -C "tnc.mmo9@gmail.com"
```

Rồi copy public key → [GitHub SSH Settings](https://github.com/settings/keys) → **New SSH key** → paste.

---

## Lưu ý quan trọng

> ⚠️ **KHÔNG dùng HTTPS** (`https://github.com/...`) — account `chuyentn` bị 403.
> ✅ **Luôn dùng SSH** (`git@github.com:...`) — key `ed25519` đã bind org `Breaths-Live`.
