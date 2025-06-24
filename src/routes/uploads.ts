import { FastifyInstance } from 'fastify'
import {
  uploadToS3,
  deleteFromS3,
  getPresignedUploadUrl,
  generateFileName,
  resizeImage,
  extractFileNameFromS3Url,
  getFolderTypeFromUrl,
  FolderType,
  UPLOAD_CONFIGS,
} from '../utils/s3.js'

export default async function uploadsRoutes(fastify: FastifyInstance) {
  // Rota para upload direto de arquivo via multipart
  fastify.post('/upload', async (request, reply) => {
    try {
      const data = await request.file()

      if (!data) {
        return reply.code(400).send({ error: 'Nenhum arquivo enviado' })
      }

      // Obter folderType dos query parameters (portraits, tokens, maps, general)
      const folderType =
        ((request.query as any)?.folderType as FolderType) || 'GENERAL'
      const category = (request.query as any)?.category as string

      if (!Object.keys(UPLOAD_CONFIGS).includes(folderType)) {
        return reply
          .code(400)
          .send({
            error:
              'folderType inválido. Use: PORTRAITS, TOKENS, MAPS ou GENERAL',
          })
      }

      // Verificar configurações do tipo de arquivo
      const config = UPLOAD_CONFIGS[folderType]

      // Ler o arquivo em buffer
      const chunks: Buffer[] = []
      for await (const chunk of data.file) {
        chunks.push(chunk)
      }
      const buffer = Buffer.concat(chunks)

      // Verificar tamanho do arquivo
      if (buffer.length > config.maxSize) {
        return reply.code(400).send({
          error: `Arquivo muito grande. Máximo: ${
            config.maxSize / (1024 * 1024)
          }MB`,
        })
      }

      // Verificar tipo de arquivo
      const isValidType = config.allowedTypes.some(
        type => type === data.mimetype
      )
      if (!isValidType) {
        return reply.code(400).send({
          error: `Tipo de arquivo não permitido. Tipos aceitos: ${config.allowedTypes.join(
            ', '
          )}`,
        })
      }

      let finalBuffer = buffer

      // Redimensionar imagens se necessário
      if (folderType !== 'GENERAL' && data.mimetype.startsWith('image/')) {
        const resizeConfig = (config as any).resize
        if (resizeConfig) {
          finalBuffer = await resizeImage(
            buffer,
            resizeConfig.width,
            resizeConfig.height,
            resizeConfig.quality
          )
        }
      }

      // Gerar nome único do arquivo
      const fileName = generateFileName(data.filename, category)

      // Metadata para o arquivo
      const metadata = {
        originalName: data.filename,
        uploadedAt: new Date().toISOString(),
        category: category || 'general',
      }

      // Upload para S3
      const url = await uploadToS3(
        folderType,
        finalBuffer,
        fileName,
        data.mimetype,
        metadata
      )

      reply.send({
        success: true,
        url,
        fileName,
        folderType,
        size: finalBuffer.length,
        originalName: data.filename,
      })
    } catch (error) {
      fastify.log.error('Erro no upload:', error)
      reply.code(500).send({ error: 'Erro interno do servidor' })
    }
  })

  // Rota para obter URL assinada para upload direto do frontend
  fastify.post<{
    Body: {
      folderType: FolderType
      fileName: string
      contentType: string
      category?: string
    }
  }>('/upload/presigned', async (request, reply) => {
    try {
      const { folderType, fileName, contentType, category } = request.body

      // Verificar configurações do tipo de arquivo
      const config = UPLOAD_CONFIGS[folderType]

      const isValidType = config.allowedTypes.some(type => type === contentType)
      if (!isValidType) {
        return reply.code(400).send({
          error: `Tipo de arquivo não permitido. Tipos aceitos: ${config.allowedTypes.join(
            ', '
          )}`,
        })
      }

      // Gerar nome único do arquivo
      const uniqueFileName = generateFileName(fileName, category)

      // Gerar URL assinada
      const presignedUrl = await getPresignedUploadUrl(
        folderType,
        uniqueFileName,
        contentType
      )

      reply.send({
        success: true,
        presignedUrl,
        fileName: uniqueFileName,
        folderType,
        maxSize: config.maxSize,
      })
    } catch (error) {
      fastify.log.error('Erro ao gerar URL assinada:', error)
      reply.code(500).send({ error: 'Erro interno do servidor' })
    }
  })

  // Rota para deletar arquivo
  fastify.delete<{
    Body: {
      url: string
    }
  }>('/upload', async (request, reply) => {
    try {
      const { url } = request.body

      // Extrair informações da URL
      const fileName = extractFileNameFromS3Url(url)
      const folderType = getFolderTypeFromUrl(url)

      if (!fileName || !folderType) {
        return reply.code(400).send({ error: 'URL inválida' })
      }

      // Deletar do S3
      await deleteFromS3(folderType, fileName)

      reply.send({
        success: true,
        message: 'Arquivo deletado com sucesso',
      })
    } catch (error) {
      fastify.log.error('Erro ao deletar arquivo:', error)
      reply.code(500).send({ error: 'Erro interno do servidor' })
    }
  })

  // Rota para listar configurações de upload
  fastify.get('/upload/config', async (request, reply) => {
    reply.send({
      folders: Object.keys(UPLOAD_CONFIGS),
      configs: UPLOAD_CONFIGS,
    })
  })
}
