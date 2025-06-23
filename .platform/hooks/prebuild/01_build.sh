#!/bin/bash

echo "🔨 Building TypeScript..."
npm run build
echo "✅ Build completed!"

echo "🔧 Copying schema files..."
node scripts/copy-schemas.js
echo "✅ Schema files copied!" 