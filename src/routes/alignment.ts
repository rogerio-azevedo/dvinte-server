import { FastifyInstance } from 'fastify'
import models from '../models/index'

export default async function alignmentRoutes(fastify: FastifyInstance) {
  // Get all alignments
  fastify.get('/alignments', async (request, reply) => {
    try {
      const alignments = await models.Alignment.findAll({
        order: [['name', 'ASC']],
      })
      return reply.send(alignments)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch alignments' })
    }
  })

  // Get alignment by ID
  fastify.get('/alignments/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const alignment = await models.Alignment.findByPk(parseInt(id))

      if (!alignment) {
        return reply.code(404).send({ error: 'Alignment not found' })
      }

      return reply.send(alignment)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch alignment' })
    }
  })

  // Create new alignment
  fastify.post('/alignments', async (request, reply) => {
    try {
      const { name } = request.body as { name: string }
      const alignment = await models.Alignment.create({
        name: name.toUpperCase(),
      })
      return reply.code(201).send(alignment)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create alignment' })
    }
  })
}
