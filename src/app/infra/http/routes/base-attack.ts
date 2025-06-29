import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import models from '../../db/models'

const baseAttackSchema = z.object({
  level: z.union([z.number(), z.string()]).transform(val => Number(val)),
  low: z.union([z.number(), z.string()]).transform(val => Number(val)),
  medium: z.union([z.number(), z.string()]).transform(val => Number(val)),
  high: z.union([z.number(), z.string()]).transform(val => Number(val)),
})

const bulkBaseAttackSchema = z.array(baseAttackSchema)

export default async function baseAttackRoutes(fastify: FastifyInstance) {
  // Get all base attacks
  fastify.get('/base-attacks', async (_request, reply) => {
    try {
      const baseAttacks = await models.BaseAttack.findAll({
        order: [['level', 'ASC']],
      })
      return reply.send(baseAttacks)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch base attacks' })
    }
  })

  // Get base attack by level
  fastify.get('/base-attacks/:level', async (request, reply) => {
    try {
      const { level } = request.params as { level: string }
      const baseAttack = await models.BaseAttack.findOne({
        where: { level: parseInt(level) },
      })

      if (!baseAttack) {
        return reply
          .code(404)
          .send({ error: 'Base attack not found for this level' })
      }

      return reply.send(baseAttack)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch base attack' })
    }
  })

  // Create multiple base attacks
  fastify.post('/base-attacks/bulk', async (request, reply) => {
    try {
      const baseAttacksData = bulkBaseAttackSchema.parse(request.body)

      // Verificar se já existem registros para os níveis informados
      const levels = baseAttacksData.map(attack => attack.level)
      const existingAttacks = await models.BaseAttack.findAll({
        where: { level: levels },
      })

      if (existingAttacks.length > 0) {
        const existingLevels = existingAttacks.map(attack => attack.level)
        return reply.code(400).send({
          error: 'Some levels already have base attacks defined',
          levels: existingLevels,
        })
      }

      const baseAttacks = await models.BaseAttack.bulkCreate(baseAttacksData, {
        returning: true,
      })

      return reply.code(201).send(baseAttacks)
    } catch (error) {
      fastify.log.error(error)
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Invalid base attack data',
          details: error.errors,
        })
      }
      return reply.code(400).send({ error: 'Failed to create base attacks' })
    }
  })

  // Create single base attack
  fastify.post('/base-attacks', async (request, reply) => {
    try {
      const baseAttackData = baseAttackSchema.parse(request.body)

      // Verificar se já existe um registro para este nível
      const existingAttack = await models.BaseAttack.findOne({
        where: { level: baseAttackData.level },
      })

      if (existingAttack) {
        return reply
          .code(400)
          .send({ error: 'Base attack already exists for this level' })
      }

      const baseAttack = await models.BaseAttack.create(baseAttackData)
      return reply.code(201).send(baseAttack)
    } catch (error) {
      fastify.log.error(error)
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Invalid base attack data',
          details: error.errors,
        })
      }
      return reply.code(400).send({ error: 'Failed to create base attack' })
    }
  })

  // Update base attack
  fastify.put('/base-attacks/:level', async (request, reply) => {
    try {
      const { level } = request.params as { level: string }
      const baseAttackData = baseAttackSchema.parse(request.body)

      const baseAttack = await models.BaseAttack.findOne({
        where: { level: parseInt(level) },
      })

      if (!baseAttack) {
        return reply
          .code(404)
          .send({ error: 'Base attack not found for this level' })
      }

      await baseAttack.update(baseAttackData)
      return reply.send(baseAttack)
    } catch (error) {
      fastify.log.error(error)
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Invalid base attack data',
          details: error.errors,
        })
      }
      return reply.code(400).send({ error: 'Failed to update base attack' })
    }
  })

  // Delete base attack
  fastify.delete('/base-attacks/:level', async (request, reply) => {
    try {
      const { level } = request.params as { level: string }
      const baseAttack = await models.BaseAttack.findOne({
        where: { level: parseInt(level) },
      })

      if (!baseAttack) {
        return reply
          .code(404)
          .send({ error: 'Base attack not found for this level' })
      }

      await baseAttack.destroy()
      return reply.code(204).send()
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to delete base attack' })
    }
  })
}
