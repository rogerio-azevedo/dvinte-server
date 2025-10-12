import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import models from '../../db/models'

export default async function weaponRoutes(fastify: FastifyInstance) {
  // Get all weapons
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

  // Get weapon by ID
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

  // Create new weapon
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

      const weapon = await models.Weapon.create({
        ...weaponData,
        name: weaponData.name.toUpperCase(),
      })

      return reply.code(201).send(weapon)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({
        error: 'Failed to create weapon',
        details: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  })

  // Update weapon
  fastify.put('/weapons/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const weaponData = request.body as any

      const weapon = await models.Weapon.findByPk(parseInt(id))

      if (!weapon) {
        return reply.code(404).send({ error: 'Weapon not found' })
      }

      // Normaliza os valores numéricos: converte string vazia para 0
      const normalizedData = {
        ...weaponData,
        name: weaponData.name.toUpperCase(),
        dice_s: Number(weaponData.dice_s) || 0,
        dice_m: Number(weaponData.dice_m) || 0,
        multiplier_s: Number(weaponData.multiplier_s) || 0,
        multiplier_m: Number(weaponData.multiplier_m) || 0,
        critical: Number(weaponData.critical) || 0,
        crit_from: Number(weaponData.crit_from) || 0,
        range: Number(weaponData.range) || 0,
        weight: Number(weaponData.weight) || 0,
        price: Number(weaponData.price) || 0,
        str_bonus: Number(weaponData.str_bonus) || 0,
      }

      await weapon.update(normalizedData)

      return reply.send(weapon)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to update weapon' })
    }
  })

  // Delete weapon
  fastify.delete('/weapons/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const weapon = await models.Weapon.findByPk(parseInt(id))

      if (!weapon) {
        return reply.code(404).send({ error: 'Weapon not found' })
      }

      await weapon.destroy()

      return reply.code(204).send()
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to delete weapon' })
    }
  })
}
