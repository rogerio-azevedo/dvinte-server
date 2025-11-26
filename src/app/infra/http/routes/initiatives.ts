import { FastifyInstance } from 'fastify'
import { Initiative } from '../../db/schemas/index'
import { saveMessage } from '../../../shared/utils/websocket'

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

      // Usar a função saveMessage para broadcast
      saveMessage({
        event: 'init.message',
        data: message,
      })

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

      // Usar a função saveMessage para broadcast
      saveMessage({
        event: 'init.clear',
        data: {
          message: 'Initiatives cleared',
        },
      })

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

  // Update initiative (for reordering)
  fastify.put('/initiatives/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { initiative } = request.body as { initiative: number }

      const updatedInitiative = await Initiative.findByIdAndUpdate(
        id,
        { initiative },
        { new: true }
      )

      if (!updatedInitiative) {
        return reply.code(404).send({ error: 'Initiative not found' })
      }

      // Emit Socket.IO event for real-time updates
      const message = {
        user: updatedInitiative.user,
        initiative: updatedInitiative.initiative,
        user_id: updatedInitiative.user_id,
        _id: updatedInitiative._id,
        createdAt: updatedInitiative.createdAt,
        updatedAt: updatedInitiative.updatedAt,
      }

      // Usar a função saveMessage para broadcast
      saveMessage({
        event: 'init.update',
        data: message,
      })

      fastify.log.info(`Initiative updated: ${id} with initiative ${initiative}`)
      return reply.send(updatedInitiative)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to update initiative' })
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

      // Usar a função saveMessage para broadcast
      saveMessage({
        event: 'init.delete',
        data: { id },
      })

      fastify.log.info(`Initiative deleted: ${id}`)
      return reply.send(deletedInitiative)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to delete initiative' })
    }
  })
}
