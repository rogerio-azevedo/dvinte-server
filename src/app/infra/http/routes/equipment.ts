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

      // Normaliza os valores numéricos: converte string vazia para 0
      const normalizedData = {
        ...equipmentData,
        name: equipmentData.name.toUpperCase(),
        str_temp: Number(equipmentData.str_temp) || 0,
        dex_temp: Number(equipmentData.dex_temp) || 0,
        con_temp: Number(equipmentData.con_temp) || 0,
        int_temp: Number(equipmentData.int_temp) || 0,
        wis_temp: Number(equipmentData.wis_temp) || 0,
        cha_temp: Number(equipmentData.cha_temp) || 0,
        attack_bonus: Number(equipmentData.attack_bonus) || 0,
        damage_bonus: equipmentData.damage_bonus || '',
        armor_class_bonus: Number(equipmentData.armor_class_bonus) || 0,
        fortitude_bonus: Number(equipmentData.fortitude_bonus) || 0,
        reflex_bonus: Number(equipmentData.reflex_bonus) || 0,
        will_bonus: Number(equipmentData.will_bonus) || 0,
        price: Number(equipmentData.price) || 0,
        weight: Number(equipmentData.weight) || 0,
      }

      const equipment = await models.Equipment.create(normalizedData)
      return reply.code(201).send(equipment)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create equipment' })
    }
  })

  // Update equipment
  fastify.put('/equipments/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const equipmentData = request.body as any

      const equipment = await models.Equipment.findByPk(parseInt(id))

      if (!equipment) {
        return reply.code(404).send({ error: 'Equipment not found' })
      }

      // Normaliza os valores numéricos: converte string vazia para 0
      const normalizedData = {
        ...equipmentData,
        name: equipmentData.name.toUpperCase(),
        str_temp: Number(equipmentData.str_temp) || 0,
        dex_temp: Number(equipmentData.dex_temp) || 0,
        con_temp: Number(equipmentData.con_temp) || 0,
        int_temp: Number(equipmentData.int_temp) || 0,
        wis_temp: Number(equipmentData.wis_temp) || 0,
        cha_temp: Number(equipmentData.cha_temp) || 0,
        attack_bonus: Number(equipmentData.attack_bonus) || 0,
        damage_bonus: equipmentData.damage_bonus || '',
        armor_class_bonus: Number(equipmentData.armor_class_bonus) || 0,
        fortitude_bonus: Number(equipmentData.fortitude_bonus) || 0,
        reflex_bonus: Number(equipmentData.reflex_bonus) || 0,
        will_bonus: Number(equipmentData.will_bonus) || 0,
        price: Number(equipmentData.price) || 0,
        weight: Number(equipmentData.weight) || 0,
      }

      await equipment.update(normalizedData)

      return reply.send(equipment)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to update equipment' })
    }
  })

  // Delete equipment
  fastify.delete('/equipments/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const equipment = await models.Equipment.findByPk(parseInt(id))

      if (!equipment) {
        return reply.code(404).send({ error: 'Equipment not found' })
      }

      await equipment.destroy()

      return reply.code(204).send()
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to delete equipment' })
    }
  })
}
