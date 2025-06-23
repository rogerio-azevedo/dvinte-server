#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Função para criar diretório se não existir
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`Created directory: ${dir}`)
  }
}

// Função para copiar arquivo
function copyFile(src, dest) {
  fs.copyFileSync(src, dest)
  console.log(`Copied: ${src} -> ${dest}`)
}

// Diretórios
const srcDir = path.join(__dirname, '..', 'src', 'app', 'schemas')
const destDir = path.join(__dirname, '..', 'dist', 'app', 'schemas')

console.log('🔧 Copying schema files...')
console.log(`Source: ${srcDir}`)
console.log(`Destination: ${destDir}`)

try {
  // Criar diretório de destino
  ensureDir(destDir)

  // Ler arquivos da pasta source
  const files = fs.readdirSync(srcDir)

  // Copiar cada arquivo .js
  files.forEach(file => {
    if (file.endsWith('.js')) {
      const srcFile = path.join(srcDir, file)
      const destFile = path.join(destDir, file)
      copyFile(srcFile, destFile)
    }
  })

  console.log('✅ Schema files copied successfully!')
} catch (error) {
  console.error('❌ Error copying schema files:', error)
  process.exit(1)
}
