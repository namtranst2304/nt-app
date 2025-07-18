# PowerShell Build Script for Next.js
Write-Host "🚀 Starting Next.js Build Process..." -ForegroundColor Green

# 1. Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "out" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue

# 2. Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# 3. Type checking
Write-Host "🔍 Running TypeScript checks..." -ForegroundColor Yellow
npm run type-check

# 4. Linting
Write-Host "📏 Running ESLint..." -ForegroundColor Yellow
npm run lint

# 5. Build application
Write-Host "🏗️ Building application..." -ForegroundColor Yellow
npm run build

# 6. Check build success
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build process completed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Build process failed!" -ForegroundColor Red
    exit 1
}
