import { FastifyInstance } from 'fastify'
import models from '../models/index'
import {
  uploadToR2,
  deleteFromR2,
  generateFileName,
  resizeImage,
  extractFileNameFromR2Url,
  UPLOAD_CONFIGS,
} from '../utils/R2.js'

export default async function tokenRoutes(fastify: FastifyInstance) {
  // Get all tokens
  fastify.get('/tokens', async (request, reply) => {
    try {
      const tokens = await models.Token.findAll({
        order: [['created_at', 'DESC']],
      })

      const formattedTokens = tokens.map(token => {
        return {
          ...token.toJSON(),
        }
      })

      console.log('🔍 Retrieving tokens from database:', formattedTokens)

      return reply.send(formattedTokens)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch tokens' })
    }
  })

  // Also handle with trailing slash (same handler)
  fastify.get('/tokens/', async (request, reply) => {
    try {
      const tokens = await models.Token.findAll({
        order: [['created_at', 'DESC']],
      })

      const formattedTokens = tokens.map(token => {
        return {
          ...token.toJSON(),
        }
      })

      return reply.send(formattedTokens)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch tokens' })
    }
  })

  // Get token by ID
  fastify.get('/tokens/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      // Validate that ID is not empty and is a valid number
      if (!id || id.trim() === '' || isNaN(Number(id))) {
        return reply.code(400).send({ error: 'Invalid token ID' })
      }

      const token = await models.Token.findByPk(id)

      if (!token) {
        return reply.code(404).send({ error: 'Token not found' })
      }

      return reply.send(token)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch token' })
    }
  })

  // Upload new token
  fastify.post('/tokens', async (request, reply) => {
    try {
      const data = await request.file()

      if (!data) {
        return reply.code(400).send({ error: 'No file uploaded' })
      }

      const fileName = data.filename

      // Ler o arquivo em buffer
      const chunks: Buffer[] = []
      for await (const chunk of data.file) {
        chunks.push(chunk)
      }
      const buffer = Buffer.concat(chunks)

      console.log('🔍 Recebendo token:', data.filename)
      console.log('🔍 Tipo do arquivo:', data.mimetype)
      console.log('🔍 Tamanho do arquivo:', buffer.length)

      // Verificar configurações para tokens
      const config = UPLOAD_CONFIGS.TOKENS
      console.log('🔍 Configurações de upload:', config)

      // Verificar tamanho do arquivo
      if (buffer.length > config.maxSize) {
        console.log('❌ Arquivo muito grande:', buffer.length)
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
        console.log('❌ Tipo de arquivo não permitido:', data.mimetype)
        return reply.code(400).send({
          error: `Tipo de arquivo não permitido. Tipos aceitos: ${config.allowedTypes.join(
            ', '
          )}`,
        })
      }

      // Redimensionar imagem (800x800px para tokens) mantendo formato original
      const resizeResult = await resizeImage(
        buffer,
        config.resize.width,
        config.resize.height,
        config.resize.quality,
        data.mimetype
      )
      console.log(
        '🔍 Imagem redimensionada com sucesso, formato:',
        resizeResult.mimetype
      )

      // Gerar nome único do arquivo
      const uniqueFileName = generateFileName(fileName, 'token')
      console.log('🔍 Nome único gerado:', uniqueFileName)

      // Metadata para o arquivo
      const metadata = {
        originalName: fileName,
        uploadedAt: new Date().toISOString(),
        category: 'token',
      }
      console.log('🔍 Metadata do arquivo:', metadata)

      // Upload para R2
      const r2Url = await uploadToR2(
        'TOKENS',
        resizeResult.buffer,
        uniqueFileName,
        resizeResult.mimetype, // Usa o mimetype correto preservando o formato
        metadata
      )
      console.log('🔍 Upload para R2 concluído:', r2Url)

      // Salvar no banco com a URL do R2
      const token = await models.Token.create({
        name: fileName,
        path: r2Url, // Agora salva a URL completa do R2
      })

      fastify.log.info(`Token uploaded to R2: ${fileName} -> ${uniqueFileName}`)
      return reply.send(token)
    } catch (error) {
      fastify.log.error('Error uploading token:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        details: error,
      })
      return reply.code(500).send({ error: 'Failed to upload token' })
    }
  })

  // Delete token
  fastify.delete('/tokens/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      // Validate that ID is not empty and is a valid number
      if (!id || id.trim() === '' || isNaN(Number(id))) {
        return reply.code(400).send({ error: 'Invalid token ID' })
      }

      const token = await models.Token.findByPk(id)

      if (!token) {
        return reply.code(404).send({ error: 'Token not found' })
      }

      // Delete file from R2
      if (token.path && token.path.startsWith('http')) {
        try {
          // Extrair nome do arquivo da URL R2
          const fileName = extractFileNameFromR2Url(token.path)

          if (fileName) {
            await deleteFromR2('TOKENS', fileName)
            fastify.log.info(`Token file deleted from R2: ${fileName}`)
          }
        } catch (r2Error) {
          fastify.log.warn(`Failed to delete R2 file: ${r2Error}`)
          // Continua mesmo se falhar no R2 - pelo menos remove do banco
        }
      }

      // Delete from database
      await token.destroy()

      fastify.log.info(`Token deleted: ${token.name}`)
      return reply.send({ message: 'Token deleted successfully' })
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to delete token' })
    }
  })

  // Update token
  fastify.put('/tokens/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { name } = request.body as { name: string }

      // Validate that ID is not empty and is a valid number
      if (!id || id.trim() === '' || isNaN(Number(id))) {
        return reply.code(400).send({ error: 'Invalid token ID' })
      }

      const token = await models.Token.findByPk(id)

      if (!token) {
        return reply.code(404).send({ error: 'Token not found' })
      }

      await token.update({ name })

      fastify.log.info(`Token updated: ${id}`)
      return reply.send(token)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to update token' })
    }
  })
}
