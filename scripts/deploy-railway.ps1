<#
.SYNOPSIS
Deploy World Monitor Relay to Railway.app

.DESCRIPTION
Automates common Railway deployment steps:
- Checks for railway CLI
- Prompts to login if needed
- Links project (or creates a new railway project)
- Sets environment variables
- Runs `railway up` to deploy

Run from project root: .\scripts\deploy-railway.ps1
#>

param(
    [string]$ProjectName = "worldmonitor-relay",
    [string]$Environment = "production"
)

Write-Host "\n🚆 Railway Relay Deploy Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check railway CLI
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "railway CLI not found. Install from: https://docs.railway.app/develop/cli" -ForegroundColor Yellow
    Write-Host "Or run: npm i -g @railway/cli" -ForegroundColor Gray
    exit 1
}

# Ensure logged in
$whoami = railway whoami 2>$null
if (-not $whoami) {
    Write-Host "Not logged into Railway - running login flow..." -ForegroundColor Yellow
    railway login
    if ($LASTEXITCODE -ne 0) { Write-Host "Railway login failed" -ForegroundColor Red; exit 1 }
}
else {
    Write-Host "Logged in: $whoami" -ForegroundColor Green
}

# Link or create project
Write-Host "\nLinking to Railway project (will prompt). If project doesn't exist, create one named: $ProjectName" -ForegroundColor Yellow
railway link 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "railway link failed or no link exists. Creating new project: $ProjectName" -ForegroundColor Gray
    railway init --name $ProjectName
    if ($LASTEXITCODE -ne 0) { Write-Host "Failed to create Railway project" -ForegroundColor Red; exit 1 }
}

# Set environment variables (safe defaults from .env.local)
Write-Host "\nSetting environment variables from .env.local (if present)" -ForegroundColor Yellow
$envFile = Join-Path (Get-Location) '.env.local'
if (-Not (Test-Path $envFile)) { Write-Host ".env.local not found in repo root - ensure required vars exist in Railway dashboard." -ForegroundColor Yellow }
else {
    $lines = Get-Content $envFile | Where-Object { $_ -and -not $_.TrimStart().StartsWith('#') }
    foreach ($line in $lines) {
        if ($line -match '^([^=]+)=(.*)$') {
            $k = $matches[1].Trim(); $v = $matches[2].Trim()
            # Skip empty values
            if ($v -eq '') { continue }
            Write-Host "Setting secret: $k" -ForegroundColor Gray
            # railway variables set <key> <value>
            railway variables set $k $v
        }
    }
}

# Deploy
Write-Host "\nDeploying with: railway up" -ForegroundColor Yellow
railway up
if ($LASTEXITCODE -ne 0) { Write-Host "Deployment failed. Check railway logs." -ForegroundColor Red; exit 1 }

Write-Host "\n✅ Deployment complete." -ForegroundColor Green
Write-Host "Use 'railway logs' to inspect runtime logs and 'railway status' to see project info." -ForegroundColor Cyan
