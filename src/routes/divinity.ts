import { FastifyInstance } from 'fastify'
import models from '../models/index'

export default async function divinityRoutes(fastify: FastifyInstance) {
  // Get all divinities
  fastify.get('/divinities', async (request, reply) => {
    try {
      const divinities = await models.Divinity.findAll({
        order: [['name', 'ASC']],
      })
      return reply.send(divinities)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch divinities' })
    }
  })

  // Get divinity by ID
  fastify.get('/divinities/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const divinity = await models.Divinity.findByPk(parseInt(id))

      if (!divinity) {
        return reply.code(404).send({ error: 'Divinity not found' })
      }

      return reply.send(divinity)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch divinity' })
    }
  })

  // Create new divinity
  fastify.post('/divinities', async (request, reply) => {
    try {
      const { name } = request.body as { name: string }
      const divinity = await models.Divinity.create({
        name: name.toUpperCase(),
      })
      return reply.code(201).send(divinity)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create divinity' })
    }
  })
}
