import { FastifyInstance } from 'fastify'
import { Initiative } from '../../db/schemas/index'

export default async function initiativeRoutes(fastify: FastifyInstance) {
  // Get all initiatives
  fastify.get('/initiatives', async (request, reply) => {
    try {
      const initiatives = await Initiative.find().sort({ initiative: -1 })
      return reply.send(initiatives)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch initiatives' })
    }
  })

  // Create new initiative
  fastify.post('/initiatives', async (request, reply) => {
    try {
      const { user_id, user, initiative } = request.body as {
        user_id: number
        user: string
        initiative: number
      }

      const newInitiative = await Initiative.create({
        user_id,
        user,
        initiative,
      })

      // Emit Socket.IO event for real-time updates
      const message = {
        user: newInitiative.user,
        initiative: newInitiative.initiative,
        user_id: newInitiative.user_id,
        _id: newInitiative._id,
        createdAt: newInitiative.createdAt,
        updatedAt: newInitiative.updatedAt,
      }

      // @ts-ignore - fastify.io is added by the plugin
      fastify.io.emit('init.message', message)

      fastify.log.info(`Initiative created for user ${user}: ${initiative}`)
      return reply.send(newInitiative)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create initiative' })
    }
  })

  // Delete all initiatives (clear board)
  fastify.delete('/initiatives', async (request, reply) => {
    try {
      const result = await Initiative.deleteMany({})

      // Emit Socket.IO event to clear initiatives for all clients
      // @ts-ignore - fastify.io is added by the plugin
      fastify.io.emit('init.clear', {})

      fastify.log.info(`Cleared ${result.deletedCount} initiatives`)
      return reply.send({
        message: 'All initiatives cleared',
        deletedCount: result.deletedCount,
      })
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to clear initiatives' })
    }
  })

  // Delete specific initiative
  fastify.delete('/initiatives/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const deletedInitiative = await Initiative.findByIdAndDelete(id)

      if (!deletedInitiative) {
        return reply.code(404).send({ error: 'Initiative not found' })
      }

      // Emit Socket.IO event
      // @ts-ignore - fastify.io is added by the plugin
      fastify.io.emit('init.delete', { id })

      fastify.log.info(`Initiative deleted: ${id}`)
      return reply.send(deletedInitiative)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to delete initiative' })
    }
  })
}
