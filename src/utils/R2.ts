import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'crypto'
import sharp from 'sharp'

// Configuração do bucket R2 com pastas
export const R2_BUCKET = process.env.R2_BUCKET_NAME

export const R2_FOLDERS = {
  PORTRAITS: 'portraits/',
  TOKENS: 'tokens/',
  MAPS: 'maps/',
  GENERAL: 'general/',
} as const

export type FolderType = keyof typeof R2_FOLDERS

// Cliente R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_ACCESS_SECRET_KEY!,
  },
})

//Gera um nome único para o arquivo
export function generateFileName(
  originalName: string,
  prefix?: string
): string {
  const timestamp = Date.now()
  const randomHash = crypto.randomBytes(8).toString('hex')
  const extension = originalName.split('.').pop()
  const baseName = prefix ? `${prefix}_` : ''

  return `${baseName}${timestamp}_${randomHash}.${extension}`
}

//Redimensiona uma imagem mantendo a proporção e formato original
export async function resizeImage(
  buffer: Buffer,
  maxWidth: number = 3500,
  maxHeight: number = 3500,
  quality: number = 100,
  originalMimetype?: string
): Promise<{ buffer: Buffer; mimetype: string }> {
  // Detectar o formato da imagem original
  const sharpInstance = sharp(buffer)
  const metadata = await sharpInstance.metadata()

  // Determinar o formato de saída baseado no mimetype original
  let outputFormat = 'jpeg'
  let outputMimetype = 'image/jpeg'

  if (originalMimetype) {
    if (originalMimetype === 'image/png') {
      outputFormat = 'png'
      outputMimetype = 'image/png'
    } else if (originalMimetype === 'image/webp') {
      outputFormat = 'webp'
      outputMimetype = 'image/webp'
    }
  } else if (metadata.format) {
    // Fallback para o formato detectado pelo Sharp
    if (metadata.format === 'png') {
      outputFormat = 'png'
      outputMimetype = 'image/png'
    } else if (metadata.format === 'webp') {
      outputFormat = 'webp'
      outputMimetype = 'image/webp'
    }
  }

  let resizeInstance = sharpInstance.resize(maxWidth, maxHeight, {
    fit: 'inside',
    withoutEnlargement: true,
  })

  // Aplicar o formato correto mantendo transparência
  if (outputFormat === 'png') {
    resizeInstance = resizeInstance.png({ quality })
  } else if (outputFormat === 'webp') {
    resizeInstance = resizeInstance.webp({ quality })
  } else {
    resizeInstance = resizeInstance.jpeg({ quality })
  }

  const resultBuffer = await resizeInstance.toBuffer()

  return {
    buffer: resultBuffer,
    mimetype: outputMimetype,
  }
}

/**
 * Faz upload de um arquivo para R2
 */
export async function uploadToR2(
  folderType: FolderType,
  file: Buffer,
  fileName: string,
  contentType: string,
  metadata?: Record<string, string>
): Promise<string> {
  console.log('🔍 Iniciando upload para R2...', fileName)

  const folder = R2_FOLDERS[folderType]
  const key = `${folder}${fileName}`

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: file,
    ContentType: contentType,
    Metadata: metadata,
  })

  try {
    await r2Client.send(command)
    console.log('✅ Upload para R2 bem-sucedido!')
  } catch (error: any) {
    console.log('❌ Erro no upload para R2:', error.message || error)
    throw error
  }

  // Retorna a URL pública do arquivo
  const finalUrl = `${process.env.R2_PUBLIC_URL}/${key}`
  return finalUrl
}

//Remove um arquivo do R2
export async function deleteFromR2(
  folderType: FolderType,
  fileName: string
): Promise<void> {
  const folder = R2_FOLDERS[folderType]
  const key = `${folder}${fileName}`

  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
  })

  await r2Client.send(command)
}

//Gera uma URL assinada para upload direto do frontend
export async function getPresignedUploadUrl(
  folderType: FolderType,
  fileName: string,
  contentType: string,
  expiresIn: number = 3600 // 1 hora
): Promise<string> {
  const folder = R2_FOLDERS[folderType]
  const key = `${folder}${fileName}`

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  })

  return await getSignedUrl(r2Client, command, { expiresIn })
}

//Extrai o nome do arquivo de uma URL R2
export function extractFileNameFromR2Url(url: string): string | null {
  try {
    const urlParts = new URL(url)
    const pathParts = urlParts.pathname.substring(1).split('/') // Remove barra inicial e separa por /
    return pathParts.slice(1).join('/') // Remove a pasta e junta o resto
  } catch {
    return null
  }
}

//Determina o tipo de pasta baseado na URL
export function getFolderTypeFromUrl(url: string): FolderType | null {
  for (const [key, folder] of Object.entries(R2_FOLDERS)) {
    if (url.includes(folder)) {
      return key as FolderType
    }
  }
  return null
}

//Configurações específicas para cada tipo de arquivo
export const UPLOAD_CONFIGS = {
  PORTRAITS: {
    maxSize: 20 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    resize: { width: 800, height: 800, quality: 95 },
  },
  TOKENS: {
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    resize: { width: 500, height: 500, quality: 95 },
  },
  MAPS: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    resize: { width: 2048, height: 2048, quality: 90 },
  },
  GENERAL: {
    maxSize: 20 * 1024 * 1024, // 20MB
    allowedTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/json',
    ],
  },
} as const
