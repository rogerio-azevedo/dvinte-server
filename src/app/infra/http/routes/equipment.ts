import { FastifyInstance } from 'fastify'
import models from '../../db/models'

export default async function equipmentRoutes(fastify: FastifyInstance) {
  // Get all equipments
  fastify.get('/equipments', async (request, reply) => {
    try {
      const equipments = await models.Equipment.findAll({
        order: [['name', 'ASC']],
      })
      return reply.send(equipments)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch equipments' })
    }
  })

  // Get equipment by ID
  fastify.get('/equipments/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const equipment = await models.Equipment.findByPk(parseInt(id))

      if (!equipment) {
        return reply.code(404).send({ error: 'Equipment not found' })
      }

      return reply.send(equipment)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch equipment' })
    }
  })

  // Create new equipment
  fastify.post('/equipments', async (request, reply) => {
    try {
      const equipmentData = request.body as any
      const equipment = await models.Equipment.create({
        ...equipmentData,
        name: equipmentData.name.toUpperCase(),
      })
      return reply.code(201).send(equipment)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create equipment' })
    }
  })
}
