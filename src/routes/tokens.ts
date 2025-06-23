import { FastifyInstance } from 'fastify'
import { Token } from '../models/index.js'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default async function tokenRoutes(fastify: FastifyInstance) {
  // Get all tokens - handle both with and without trailing slash
  fastify.get('/tokens', async (request, reply) => {
    try {
      const tokens = await Token.findAll({
        attributes: ['id', 'name', 'path', 'url'],
        order: [['created_at', 'DESC']],
      })

      return reply.send(tokens)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch tokens' })
    }
  })

  // Also handle with trailing slash (same handler)
  fastify.get('/tokens/', async (request, reply) => {
    try {
      const tokens = await Token.findAll({
        attributes: ['id', 'name', 'path', 'url'],
        order: [['created_at', 'DESC']],
      })

      return reply.send(tokens)
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

      const token = await Token.findByPk(id)

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
      const buffer = await data.toBuffer()

      // Generate unique filename
      const timestamp = Date.now()
      const ext = path.extname(fileName)
      const newName = `${timestamp}-${Math.random()
        .toString(36)
        .substring(2)}${ext}`

      // Define paths
      const uploadsDir = path.resolve(__dirname, '..', '..', 'tmp', 'uploads')
      const tokensDir = path.resolve(uploadsDir, 'tokens')
      const tempPath = path.resolve(uploadsDir, newName)
      const finalPath = path.resolve(tokensDir, newName)

      // Ensure directories exist
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      if (!fs.existsSync(tokensDir)) {
        fs.mkdirSync(tokensDir, { recursive: true })
      }

      // Save temporary file
      fs.writeFileSync(tempPath, buffer)

      try {
        // Process image with sharp
        await sharp(tempPath)
          .resize(800, 800, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .png({ quality: 95 })
          .toFile(finalPath)

        // Remove temporary file
        fs.unlinkSync(tempPath)

        // Save to database
        const token = await Token.create({
          name: fileName,
          path: newName,
        })

        fastify.log.info(`Token uploaded: ${fileName} -> ${newName}`)
        return reply.send(token)
      } catch (sharpError) {
        // Clean up files on error
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath)
        if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath)
        throw sharpError
      }
    } catch (error) {
      fastify.log.error('Error uploading token:', error)
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

      const token = await Token.findByPk(id)

      if (!token) {
        return reply.code(404).send({ error: 'Token not found' })
      }

      // Delete file from filesystem
      const filePath = path.resolve(
        __dirname,
        '..',
        '..',
        'tmp',
        'uploads',
        'tokens',
        token.path
      )

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        fastify.log.info(`Token file deleted: ${token.path}`)
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

      const token = await Token.findByPk(id)

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
