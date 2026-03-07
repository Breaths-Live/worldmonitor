#!/usr/bin/env pwsh
<#
.SYNOPSIS
Deploy World Monitor Relay to Fly.io

.DESCRIPTION
This script automates deployment of the relay server to Fly.io:
1. Installs Fly CLI
2. Authenticates with Fly.io
3. Creates/updates the app
4. Sets secrets
5. Deploys the application

.USAGE
./scripts/deploy-flyio.ps1
#>

param(
    [string]$AppName = "worldmonitor-relay",
    [string]$Region = "sin",  # Singapore
    [switch]$SkipBuild = $false
)

Write-Host "`n" -ForegroundColor White
Write-Host "🚀 Fly.io Relay Deployment Script" -ForegroundColor Cyan
Write-Host "==================================`n" -ForegroundColor Cyan

# Step 1: Check if Fly CLI is installed
Write-Host "1️⃣  Checking Fly CLI..." -ForegroundColor Yellow
$flyVersion = fly version 2>$null
if ($flyVersion) {
    Write-Host "✅ Fly CLI installed: $flyVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Fly CLI not found. Installing..." -ForegroundColor Red
    Write-Host "   Windows: scoop install flyctl" -ForegroundColor Gray
    Write-Host "   OR download: https://fly.io/docs/hands-on/install-flyctl/" -ForegroundColor Gray
    exit 1
}

# Step 2: Check authentication
Write-Host "`n2️⃣  Checking Fly authentication..." -ForegroundColor Yellow
$authStatus = fly auth whoami 2>$null
if ($authStatus) {
    Write-Host "✅ Authenticated as: $authStatus" -ForegroundColor Green
} else {
    Write-Host "❌ Not authenticated. Logging in..." -ForegroundColor Red
    fly auth login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Authentication failed" -ForegroundColor Red
        exit 1
    }
}

# Step 3: Create or update app
Write-Host "`n3️⃣  Setting up Fly.io app: $AppName" -ForegroundColor Yellow
$appExists = fly apps list 2>$null | Select-String $AppName
if ($appExists) {
    Write-Host "✅ App exists: $AppName" -ForegroundColor Green
} else {
    Write-Host "   Creating new app..." -ForegroundColor Gray
    fly apps create $AppName --region=$Region
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to create app" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ App created: $AppName" -ForegroundColor Green
}

# Step 4: Set environment secrets
Write-Host "`n4️⃣  Setting environment secrets..." -ForegroundColor Yellow
$secrets = @(
    "AISSTREAM_API_KEY=d901004ff3eced23bc5d0d942f0a009235ba8928"
    "OPENSKY_CLIENT_ID=coachchuyen-api-client"
    "OPENSKY_CLIENT_SECRET=AnB3YU1LnxEeTe39baFYlLb4SFfOjhjK"
    "TELEGRAM_API_ID=21575411"
    "TELEGRAM_API_HASH=a3dbd4a4d8a6a24ff1c1eee5e5c8d9e7"
    "RELAY_SHARED_SECRET=`$wm_relay_2024_secure_shared_secret_coachchuyen"
    "NODE_ENV=production"
    "PORT=8081"
)

foreach ($secret in $secrets) {
    $key, $value = $secret -split '=', 2
    Write-Host "   Setting $key..." -ForegroundColor Gray
    fly secrets set "$key=$value" --app=$AppName 2>$null
}
Write-Host "✅ Secrets configured" -ForegroundColor Green

# Step 5: Deploy
Write-Host "`n5️⃣  Deploying to Fly.io..." -ForegroundColor Yellow
Write-Host "   This may take 2-5 minutes..." -ForegroundColor Gray

if ($SkipBuild) {
    fly deploy --app=$AppName --skip-strategies=build
} else {
    fly deploy --app=$AppName
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    
    # Get the deployed URL
    $appUrl = "https://$AppName.fly.dev"
    Write-Host "`n🎉 Your relay is LIVE!" -ForegroundColor Cyan
    Write-Host "📍 URL: $appUrl" -ForegroundColor Cyan
    Write-Host "📍 API Status: $appUrl/api/service-status" -ForegroundColor Cyan
    
    # Show next steps
    Write-Host "`n📋 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Update .env.local with new URL:" -ForegroundColor White
    Write-Host "   WS_RELAY_URL=https://$AppName.fly.dev" -ForegroundColor Gray
    Write-Host "   VITE_WS_RELAY_URL=wss://$AppName.fly.dev" -ForegroundColor Gray
    Write-Host "`n2. Test relay health:" -ForegroundColor White
    Write-Host "   curl https://$AppName.fly.dev/api/service-status" -ForegroundColor Gray
    Write-Host "`n3. View logs:" -ForegroundColor White
    Write-Host "   fly logs --app=$AppName" -ForegroundColor Gray
    Write-Host "`n4. SSH into server:" -ForegroundColor White
    Write-Host "   fly ssh console --app=$AppName" -ForegroundColor Gray
    
} else {
    Write-Host "❌ Deployment failed. Check logs:" -ForegroundColor Red
    Write-Host "   fly logs --app=$AppName" -ForegroundColor Gray
    exit 1
}

Write-Host "`n" -ForegroundColor White
