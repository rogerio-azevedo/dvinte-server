#!/bin/bash

# Script de pre-build para Elastic Beanstalk
# Este script é executado antes do deploy da aplicação

echo "🚀 Iniciando pre-build do DVinte Backend..."

# Navegar para o diretório da aplicação
cd /var/app/staging

# Verificar se o package.json existe
if [ ! -f "package.json" ]; then
  echo "❌ Erro: package.json não encontrado!"
  exit 1
fi

echo "📦 Instalando dependências..."
npm ci --only=production

echo "🔨 Instalando dependências de desenvolvimento para o build..."
npm install --only=dev

echo "🏗️ Compilando TypeScript para JavaScript..."
npm run build

# Verificar se o build foi bem-sucedido
if [ ! -f "dist/server.js" ]; then
  echo "❌ Erro: Build falhou! Arquivo dist/server.js não foi gerado."
  exit 1
fi

echo "✅ Build concluído com sucesso!"
echo "📁 Arquivos gerados em ./dist/"
ls -la dist/

echo "🧹 Removendo dependências de desenvolvimento para reduzir tamanho..."
npm prune --production

echo "✨ Pre-build finalizado!"
