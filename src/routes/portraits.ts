import { FastifyInstance } from 'fastify'
import { Portrait } from '../models/index.js'
import {
  uploadToS3,
  deleteFromS3,
  generateFileName,
  resizeImage,
  extractFileNameFromS3Url,
  UPLOAD_CONFIGS,
  S3_BUCKET,
} from '../utils/s3.js'

export default async function portraitRoutes(fastify: FastifyInstance) {
  // Get all portraits
  fastify.get('/portraits', async (request, reply) => {
    try {
      const portraits = await Portrait.findAll({
        order: [['created_at', 'DESC']],
      })

      const formattedPortraits = portraits.map(portrait => {
        return {
          ...portrait.toJSON(),
          // url:
          //   portrait.path && portrait.path.startsWith('http')
          //     ? portrait.path
          //     : `https://${S3_BUCKET}.s3.${
          //         process.env.AWS_REGION
          //       }.amazonaws.com/portraits/${portrait.path || ''}`,
        }
      })
      console.log('🚀 ~ fastify.get ~ formattedPortraits:', formattedPortraits)

      // const validPortraits = portraits.filter(portrait => portrait.path)

      // const portraitsWithUrls = portraits.map(portrait => {
      //   const isS3Url = portrait.path && portrait.path.startsWith('http')
      //   const url = isS3Url
      //     ? portrait.path
      //     : `https://${S3_BUCKET}.s3.${
      //         process.env.AWS_REGION
      //       }.amazonaws.com/portraits/${portrait.path || ''}`
      //   return { formattedPortraits }
      // })

      console.log('🔍 Retrieving portraits from database:', formattedPortraits)

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

      const portrait = await Portrait.findByPk(id)

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

      // Redimensionar imagem (400x400px para portraits)
      const resizedBuffer = await resizeImage(
        buffer,
        config.resize.width,
        config.resize.height,
        config.resize.quality
      )
      console.log('🔍 Imagem redimensionada com sucesso')

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

      // Upload para S3
      const s3Url = await uploadToS3(
        'PORTRAITS',
        resizedBuffer,
        uniqueFileName,
        'image/jpeg', // Sharp sempre converte para JPEG
        metadata
      )
      console.log('🔍 Upload para S3 concluído:', s3Url)

      // Salvar no banco com a URL do S3
      const portrait = await Portrait.create({
        name: fileName,
        path: s3Url, // Agora salva a URL completa do S3
      })

      fastify.log.info(
        `Portrait uploaded to S3: ${fileName} -> ${uniqueFileName}`
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

      const portrait = await Portrait.findByPk(id)

      if (!portrait) {
        return reply.code(404).send({ error: 'Portrait not found' })
      }

      // Delete file from S3 if it's an S3 URL
      if (
        portrait.path.includes('s3.') ||
        portrait.path.includes('amazonaws.com')
      ) {
        try {
          // Extrair nome do arquivo da URL S3
          const fileName = extractFileNameFromS3Url(portrait.path)

          if (fileName) {
            await deleteFromS3('PORTRAITS', fileName)
            fastify.log.info(`Portrait file deleted from S3: ${fileName}`)
          }
        } catch (s3Error) {
          fastify.log.warn(`Failed to delete S3 file: ${s3Error}`)
          // Continua mesmo se falhar no S3 - pelo menos remove do banco
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

      const portrait = await Portrait.findByPk(id)

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
