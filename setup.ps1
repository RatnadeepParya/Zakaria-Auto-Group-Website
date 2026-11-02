<#
.SYNOPSIS
  One-shot setup script for Zakaria Auto Group LLC (Windows PowerShell).
#>
[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $Root

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Zakaria Auto Group LLC — Enterprise Setup Bootstrapper" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Environment files
if (-not (Test-Path ".env")) {
    Write-Host "==> Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Copy-Item ".env" "apps/api/.env"
    Copy-Item ".env" "apps/web/.env.local"
    Write-Host "    [ok] .env files configured" -ForegroundColor Green
} else {
    Write-Host "    [!] .env already exists, preserving current configuration." -ForegroundColor Yellow
}

# 2. Dependencies
Write-Host "==> Installing npm packages..." -ForegroundColor Yellow
npm install

# 3. Prisma Client
Write-Host "==> Generating Prisma client..." -ForegroundColor Yellow
npm run db:generate

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  Setup Completed Successfully!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "1. Start PostgreSQL (docker compose up -d postgres, or cloud DB)"
Write-Host "2. Run database migration: npm run db:migrate"
Write-Host "3. Seed demo inventory & admin: npm run db:seed"
Write-Host "4. Start local development: npm run dev"
Write-Host ""
Write-Host "Website: http://localhost:3000"
Write-Host "Admin:   http://localhost:3000/admin"
Write-Host "API:     http://localhost:4000/health"
Write-Host "=========================================================="

Pop-Location
