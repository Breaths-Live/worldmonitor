# GitHub Push — Authentication Setup (Step-by-Step)

**Status**: 🔐 Code ready to push, auth needed  
**Location**: d:\AI-KILLS\worldmonitor  
**Goal**: Push migrated code to https://github.com/Breaths-Live/worldmonitor

---

## Your Current Situation

✅ Code migrated locally (d:\AI-KILLS\worldmonitor)  
✅ Git commit created (d726c78)  
❌ GitHub push blocked (permission denied)  
✅ You've opened GitHub in browser

---

## Solution: Create & Use Personal Access Token

### Step 1: Create GitHub Personal Access Token (In Browser)

**Go to**: https://github.com/settings/tokens

1. Click **"Generate new token"** → **"Generate new token (classic)"**
2. **Token name**: `worldmonitor-deploy` (or similar)
3. **Expiration**: 30 days (or longer)
4. **Scopes** (select):
   - ☑️ `repo` (full control of private repositories)
   - ☑️ `admin:repo_hook` (for webhooks, if needed)
5. Click **"Generate token"** at bottom
6. **COPY the token** (you'll only see it once!):
   ```
   ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Step 2: Configure Git with Token (Terminal)

**In PowerShell at d:\AI-KILLS\worldmonitor**:

```powershell
# Configure git credential helper (Windows)
git config --global credential.helper wincred

# Set token for Breaths-Live repo
# Run this command:
# (replace TOKEN with your token from Step 1)

git credential approve
# Press Enter, then type:
protocol=https
host=github.com
username=YOUR_GITHUB_USERNAME
password=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# Press Ctrl+D (or Ctrl+Z if Windows)

# Then try push again:
git push origin main
```

**ALTERNATIVE (Simpler)**: Update remote URL with token:

```powershell
cd d:\AI-KILLS\worldmonitor

# Replace YOUR_TOKEN and YOUR_USERNAME
git remote set-url origin https://YOUR_GITHUB_USERNAME:ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@github.com/Breaths-Live/worldmonitor.git

# Push
git push origin main
```

### Step 3: Verify GitHub Shows Your Code

**After push succeeds** (check command output):
```
Enumerating objects: 630, done.
Counting objects: 100% (650/650), done.
...
To https://github.com/Breaths-Live/worldmonitor.git
 d726c78..1d089a6  main -> main
```

**Go to**: https://github.com/Breaths-Live/worldmonitor

You should see:
- Branch: `main`
- Latest commit: "Initial migration: transfer codebase..."
- Files: `src/`, `api/`, `docs/`, `convex/`, `public/`, `package.json`, etc.

---

## Quick Reference

**If you don't know your GitHub username**:
1. Go to: https://github.com/settings/profile
2. Look for **"Name"** or **"Username"** field
3. Username is what shows in URL: `github.com/YOUR_USERNAME`

**Token looks like**: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` (starts with `ghp_`)

**DO NOT share token** — keep it secret like a password!

---

## If Token Method Still Fails

**Alternative: SSH Setup**

```powershell
# Check if SSH key exists
Test-Path $HOME\.ssh\id_rsa

# If not, generate one (press Enter for defaults)
ssh-keygen -t rsa -b 4096 -f $HOME\.ssh\id_rsa -N ""

# Copy public key to clipboard
Get-Content $HOME\.ssh\id_rsa.pub | Set-Clipboard

# Go to: https://github.com/settings/keys
# Click "New SSH key"
# Paste key, save

# Update git remote to use SSH
git remote set-url origin git@github.com:Breaths-Live/worldmonitor.git

# Try push
git push origin main
```

---

## Status After Push

Once push succeeds, you'll see:
```
Your branch is up to date with 'origin/main'.
```

Then proceed to **Step 2: Verify Local Build** (next in deployment plan).

---

**Next Command to Run** (once token is set up):

```powershell
cd d:\AI-KILLS\worldmonitor
git push origin main
```

If successful → proceed to Step 2!

---

Created: 2026-03-07
