#!/bin/bash

# Pre-build script for Next.js
echo "🚀 Starting Next.js Build Process..."

# 1. Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf out
rm -rf node_modules/.cache

# 2. Type checking
echo "🔍 Running TypeScript checks..."
npm run type-check

# 3. Linting
echo "📏 Running ESLint..."
npm run lint

# 4. Build application
echo "🏗️ Building application..."
npm run build

# 5. Analyze bundle (optional)
if [ "$ANALYZE" = "true" ]; then
    echo "📊 Analyzing bundle size..."
    npm run build:analyze
fi

echo "✅ Build process completed successfully!"
