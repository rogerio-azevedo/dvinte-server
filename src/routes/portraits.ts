import { FastifyInstance } from 'fastify'
import { Portrait } from '../models/index.js'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default async function portraitRoutes(fastify: FastifyInstance) {
  // Get all portraits
  fastify.get('/portraits', async (request, reply) => {
    try {
      const portraits = await Portrait.findAll({
        order: [['created_at', 'DESC']],
      })

      return reply.send(portraits)
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
      const buffer = await data.toBuffer()

      // Generate unique filename
      const timestamp = Date.now()
      const ext = path.extname(fileName)
      const newName = `${timestamp}-${Math.random()
        .toString(36)
        .substring(2)}${ext}`

      // Define paths
      const uploadsDir = path.resolve(__dirname, '..', '..', 'tmp', 'uploads')
      const portraitsDir = path.resolve(uploadsDir, 'portraits')
      const tempPath = path.resolve(uploadsDir, newName)
      const finalPath = path.resolve(portraitsDir, newName)

      // Ensure directories exist
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true })
      }
      if (!fs.existsSync(portraitsDir)) {
        fs.mkdirSync(portraitsDir, { recursive: true })
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
        const portrait = await Portrait.create({
          name: fileName,
          path: newName,
        })

        fastify.log.info(`Portrait uploaded: ${fileName} -> ${newName}`)
        return reply.send(portrait)
      } catch (sharpError) {
        // Clean up files on error
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath)
        if (fs.existsSync(finalPath)) fs.unlinkSync(finalPath)
        throw sharpError
      }
    } catch (error) {
      fastify.log.error('Error uploading portrait:', error)
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

      // Delete file from filesystem
      const filePath = path.resolve(
        __dirname,
        '..',
        '..',
        'tmp',
        'uploads',
        'portraits',
        portrait.path
      )

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        fastify.log.info(`Portrait file deleted: ${portrait.path}`)
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
