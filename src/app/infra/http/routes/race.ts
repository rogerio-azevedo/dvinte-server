import { FastifyInstance } from 'fastify'
import models from '../../db/models'

export default async function raceRoutes(fastify: FastifyInstance) {
  // Get all races
  fastify.get('/races', async (request, reply) => {
    try {
      const races = await models.Race.findAll({
        order: [['name', 'ASC']],
      })
      return reply.send(races)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch races' })
    }
  })

  // Get race by ID
  fastify.get('/races/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const race = await models.Race.findByPk(parseInt(id))

      if (!race) {
        return reply.code(404).send({ error: 'Race not found' })
      }

      return reply.send(race)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch race' })
    }
  })

  // Create new race
  fastify.post('/races', async (request, reply) => {
    try {
      const { name } = request.body as { name: string }
      const race = await models.Race.create({
        name: name.toUpperCase(),
      })
      return reply.code(201).send(race)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create race' })
    }
  })
}
