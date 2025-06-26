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

export default async function portraitRoutes(fastify: FastifyInstance) {
  // Get all portraits
  fastify.get('/portraits', async (request, reply) => {
    try {
      const portraits = await models.Portrait.findAll({
        order: [['created_at', 'DESC']],
      })

      const formattedPortraits = portraits.map(portrait => {
        const portraitData = portrait.toJSON()

        return {
          ...portraitData,
          url: portraitData.path, // URL completa da imagem (R2)
        }
      })

      console.log(
        '🔍 Retrieving portraits from database:',
        formattedPortraits.length,
        'portraits'
      )

      return reply.send(formattedPortraits)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch portraits' })
    }
  })

  // Get portrait by ID
  fastify.get('/portraits/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      // Validate that ID is not empty and is a valid number
      if (!id || id.trim() === '' || isNaN(Number(id))) {
        return reply.code(400).send({ error: 'Invalid portrait ID' })
      }

      const portrait = await models.Portrait.findByPk(id)

      if (!portrait) {
        return reply.code(404).send({ error: 'Portrait not found' })
      }

      return reply.send(portrait)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch portrait' })
    }
  })

  // Upload new portrait
  fastify.post('/portraits', async (request, reply) => {
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

      console.log('🔍 Recebendo arquivo:', data.filename)
      console.log('🔍 Tipo do arquivo:', data.mimetype)
      console.log('🔍 Tamanho do arquivo:', buffer.length)

      // Verificar configurações para portraits
      const config = UPLOAD_CONFIGS.PORTRAITS
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

      // Redimensionar imagem (400x400px para portraits) mantendo formato original
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
      const uniqueFileName = generateFileName(fileName, 'portrait')
      console.log('🔍 Nome único gerado:', uniqueFileName)

      // Metadata para o arquivo
      const metadata = {
        originalName: fileName,
        uploadedAt: new Date().toISOString(),
        category: 'portrait',
      }
      console.log('🔍 Metadata do arquivo:', metadata)

      // Upload para R2
      const r2Url = await uploadToR2(
        'PORTRAITS',
        resizeResult.buffer,
        uniqueFileName,
        resizeResult.mimetype, // Usa o mimetype correto preservando o formato
        metadata
      )
      console.log('🔍 Upload para R2 concluído:', r2Url)

      // Salvar no banco com a URL do R2
      const portrait = await models.Portrait.create({
        name: fileName,
        path: r2Url, // Agora salva a URL completa do R2
      })

      fastify.log.info(
        `Portrait uploaded to R2: ${fileName} -> ${uniqueFileName}`
      )
      return reply.send(portrait)
    } catch (error) {
      fastify.log.error('Error uploading portrait:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        details: error,
      })
      return reply.code(500).send({ error: 'Failed to upload portrait' })
    }
  })

  // Delete portrait
  fastify.delete('/portraits/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      // Validate that ID is not empty and is a valid number
      if (!id || id.trim() === '' || isNaN(Number(id))) {
        return reply.code(400).send({ error: 'Invalid portrait ID' })
      }

      const portrait = await models.Portrait.findByPk(id)

      if (!portrait) {
        return reply.code(404).send({ error: 'Portrait not found' })
      }

      // Delete file from R2
      if (portrait.path && portrait.path.startsWith('http')) {
        try {
          // Extrair nome do arquivo da URL R2
          const fileName = extractFileNameFromR2Url(portrait.path)

          if (fileName) {
            await deleteFromR2('PORTRAITS', fileName)
            fastify.log.info(`Portrait file deleted from R2: ${fileName}`)
          }
        } catch (r2Error) {
          fastify.log.warn(`Failed to delete R2 file: ${r2Error}`)
          // Continua mesmo se falhar no R2 - pelo menos remove do banco
        }
      }

      // Delete from database
      await portrait.destroy()

      fastify.log.info(`Portrait deleted: ${portrait.name}`)
      return reply.send({ message: 'Portrait deleted successfully' })
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to delete portrait' })
    }
  })

  // Update portrait
  fastify.put('/portraits/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { name } = request.body as { name: string }

      // Validate that ID is not empty and is a valid number
      if (!id || id.trim() === '' || isNaN(Number(id))) {
        return reply.code(400).send({ error: 'Invalid portrait ID' })
      }

      const portrait = await models.Portrait.findByPk(id)

      if (!portrait) {
        return reply.code(404).send({ error: 'Portrait not found' })
      }

      await portrait.update({ name })

      fastify.log.info(`Portrait updated: ${id}`)
      return reply.send(portrait)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to update portrait' })
    }
  })
}
