import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import models from '../models'

export default async function gameDataRoutes(fastify: FastifyInstance) {
  // Races
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

  // Classes
  fastify.get('/classes', async (request, reply) => {
    try {
      const classes = await models.Class.findAll({
        order: [['name', 'ASC']],
      })
      return reply.send(classes)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch classes' })
    }
  })

  fastify.get('/classes/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const characterClass = await models.Class.findByPk(parseInt(id))

      if (!characterClass) {
        return reply.code(404).send({ error: 'Class not found' })
      }

      return reply.send(characterClass)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch class' })
    }
  })

  // Alignments
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

  // Divinities
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

  // Weapons
  fastify.get('/weapons', async (request, reply) => {
    try {
      const weapons = await models.Weapon.findAll({
        order: [['name', 'ASC']],
      })
      return reply.send(weapons)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch weapons' })
    }
  })

  fastify.get('/weapons/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const weapon = await models.Weapon.findByPk(parseInt(id))

      if (!weapon) {
        return reply.code(404).send({ error: 'Weapon not found' })
      }

      return reply.send(weapon)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch weapon' })
    }
  })

  // Armors
  fastify.get('/armors', async (request, reply) => {
    try {
      const armors = await models.Armor.findAll({
        order: [['name', 'ASC']],
      })
      return reply.send(armors)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch armors' })
    }
  })

  fastify.get('/armors/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const armor = await models.Armor.findByPk(parseInt(id))

      if (!armor) {
        return reply.code(404).send({ error: 'Armor not found' })
      }

      return reply.send(armor)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch armor' })
    }
  })

  // Equipments
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

  // Create routes for game masters
  fastify.post('/races', async (request, reply) => {
    try {
      const { name } = request.body as { name: string }
      const race = await models.Race.create({ name })
      return reply.code(201).send(race)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create race' })
    }
  })

  fastify.post('/classes', async (request, reply) => {
    try {
      const classData = request.body as any
      const characterClass = await models.Class.create(classData)
      return reply.code(201).send(characterClass)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create class' })
    }
  })

  fastify.post('/alignments', async (request, reply) => {
    try {
      const { name } = request.body as { name: string }
      const alignment = await models.Alignment.create({ name })
      return reply.code(201).send(alignment)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create alignment' })
    }
  })

  fastify.post('/divinities', async (request, reply) => {
    try {
      const { name } = request.body as { name: string }
      const divinity = await models.Divinity.create({ name })
      return reply.code(201).send(divinity)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create divinity' })
    }
  })

  fastify.post('/weapons', async (request, reply) => {
    try {
      const weaponSchema = z.object({
        name: z.string().min(1),
        dice_s: z.union([z.number(), z.string()]).transform(val => Number(val)),
        dice_m: z.union([z.number(), z.string()]).transform(val => Number(val)),
        multiplier_s: z
          .union([z.number(), z.string()])
          .transform(val => Number(val)),
        multiplier_m: z
          .union([z.number(), z.string()])
          .transform(val => Number(val)),
        critical: z
          .union([z.number(), z.string()])
          .transform(val => Number(val)),
        crit_from: z
          .union([z.number(), z.string()])
          .transform(val => Number(val)),
        range: z.union([z.number(), z.string()]).transform(val => Number(val)),
        type: z.string(),
        material: z.string().optional(),
        weight: z.union([z.number(), z.string()]).transform(val => Number(val)),
        price: z
          .union([z.number(), z.string(), z.null()])
          .transform(val => (val ? Number(val) : undefined))
          .optional(),
        str_bonus: z
          .union([z.number(), z.string()])
          .transform(val => Number(val)),
        book: z.string(),
        version: z.string(),
      })

      const weaponData = weaponSchema.parse(request.body)

      // Transform name to uppercase as in the original controller
      const processedData = {
        ...weaponData,
        name: weaponData.name.toUpperCase(),
      }

      const weapon = await models.Weapon.create(processedData)
      return reply.code(201).send(weapon)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({
        error: 'Failed to create weapon',
        details: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  })

  fastify.post('/armors', async (request, reply) => {
    try {
      const armorData = request.body as any
      const armor = await models.Armor.create(armorData)
      return reply.code(201).send(armor)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create armor' })
    }
  })

  fastify.post('/equipments', async (request, reply) => {
    try {
      const equipmentData = request.body as any
      const equipment = await models.Equipment.create(equipmentData)
      return reply.code(201).send(equipment)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create equipment' })
    }
  })
}
