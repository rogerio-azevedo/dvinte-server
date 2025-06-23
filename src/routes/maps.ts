import { FastifyInstance } from 'fastify'
import { GameMap } from '../models/index.js'

export default async function mapRoutes(fastify: FastifyInstance) {
  // Get map by ID
  fastify.get('/maps/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const map = await GameMap.findByPk(id)

      if (!map) {
        return reply.code(404).send({ error: 'Map not found' })
      }

      return reply.send(map)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch map data' })
    }
  })

  // Get all maps
  fastify.get('/maps', async (request, reply) => {
    try {
      const maps = await GameMap.findAll({
        order: [['created_at', 'DESC']],
      })

      return reply.send(maps)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch maps' })
    }
  })
}
