import { FastifyInstance } from 'fastify'
import {
  Race,
  Class,
  Alignment,
  Divinity,
  Weapon,
  Armor,
  Equipment,
} from '../models/index.js'

export default async function gameDataRoutes(fastify: FastifyInstance) {
  // Races
  fastify.get('/races', async (request, reply) => {
    try {
      const races = await Race.findAll({
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
      const race = await Race.findByPk(parseInt(id))

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
      const classes = await Class.findAll({
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
      const characterClass = await Class.findByPk(parseInt(id))

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
      const alignments = await Alignment.findAll({
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
      const alignment = await Alignment.findByPk(parseInt(id))

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
      const divinities = await Divinity.findAll({
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
      const divinity = await Divinity.findByPk(parseInt(id))

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
      const weapons = await Weapon.findAll({
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
      const weapon = await Weapon.findByPk(parseInt(id))

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
      const armors = await Armor.findAll({
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
      const armor = await Armor.findByPk(parseInt(id))

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
      const equipments = await Equipment.findAll({
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
      const equipment = await Equipment.findByPk(parseInt(id))

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
      const race = await Race.create({ name })
      return reply.code(201).send(race)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create race' })
    }
  })

  fastify.post('/classes', async (request, reply) => {
    try {
      const classData = request.body as any
      const characterClass = await Class.create(classData)
      return reply.code(201).send(characterClass)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create class' })
    }
  })

  fastify.post('/alignments', async (request, reply) => {
    try {
      const { name } = request.body as { name: string }
      const alignment = await Alignment.create({ name })
      return reply.code(201).send(alignment)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create alignment' })
    }
  })

  fastify.post('/divinities', async (request, reply) => {
    try {
      const { name } = request.body as { name: string }
      const divinity = await Divinity.create({ name })
      return reply.code(201).send(divinity)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create divinity' })
    }
  })

  fastify.post('/weapons', async (request, reply) => {
    try {
      const weaponData = request.body as any
      const weapon = await Weapon.create(weaponData)
      return reply.code(201).send(weapon)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create weapon' })
    }
  })

  fastify.post('/armors', async (request, reply) => {
    try {
      const armorData = request.body as any
      const armor = await Armor.create(armorData)
      return reply.code(201).send(armor)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create armor' })
    }
  })

  fastify.post('/equipments', async (request, reply) => {
    try {
      const equipmentData = request.body as any
      const equipment = await Equipment.create(equipmentData)
      return reply.code(201).send(equipment)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create equipment' })
    }
  })
}
