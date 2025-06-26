import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import models from '../models'

const armorSchema = z.object({
  name: z.string().min(1),
  bonus: z.union([z.number(), z.string()]).transform(val => Number(val)),
  dexterity: z.union([z.number(), z.string()]).transform(val => Number(val)),
  penalty: z.union([z.number(), z.string()]).transform(val => Number(val)),
  magic: z.union([z.number(), z.string()]).transform(val => Number(val)),
  price: z.union([z.number(), z.string()]).transform(val => Number(val)),
  displacement_s: z
    .union([z.number(), z.string()])
    .transform(val => Number(val)),
  displacement_m: z
    .union([z.number(), z.string()])
    .transform(val => Number(val)),
  type: z.union([z.number(), z.string()]).transform(val => Number(val)),
  weight: z.union([z.number(), z.string()]).transform(val => Number(val)),
  book: z.string(),
  version: z.string(),
})

export default async function armorRoutes(fastify: FastifyInstance) {
  // Get all armors
  fastify.get('/armors', async (_request, reply) => {
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

  // Get armor by ID
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

  // Create new armor
  fastify.post('/armors', async (request, reply) => {
    try {
      const armorSchema = z.object({
        name: z.string().min(1),
        type: z.union([z.number(), z.string()]).transform(val => {
          const num = Number(val)
          return isNaN(num) ? 1 : num // Valor padrão 1 se for NaN
        }),
        bonus: z.union([z.number(), z.string()]).transform(val => Number(val)),
        dexterity: z
          .union([z.number(), z.string()])
          .transform(val => Number(val)),
        penalty: z
          .union([z.number(), z.string()])
          .transform(val => Number(val)),
        magic: z.union([z.number(), z.string()]).transform(val => Number(val)),
        displacement_s: z
          .union([z.number(), z.string()])
          .transform(val => Number(val)),
        displacement_m: z
          .union([z.number(), z.string()])
          .transform(val => Number(val)),
        weight: z.union([z.number(), z.string()]).transform(val => Number(val)),
        price: z.union([z.number(), z.string()]).transform(val => Number(val)),
        book: z.string(),
        version: z.string(),
      })

      const armorData = armorSchema.parse(request.body)

      const armor = await models.Armor.create({
        ...armorData,
        name: armorData.name.toUpperCase(),
      })

      return reply.code(201).send(armor)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({
        error: 'Failed to create armor',
        details: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  })
}
