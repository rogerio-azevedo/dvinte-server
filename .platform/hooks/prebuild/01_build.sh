#!/bin/bash

echo "🔨 Building TypeScript..."

# Instalar dependências de desenvolvimento
npm install --include=dev

# Executar o build
npm run build

echo "✅ Build completed!" 