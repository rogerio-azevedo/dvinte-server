import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import models from '../../db/models'

const baseResistSchema = z.object({
  level: z.union([z.number(), z.string()]).transform(val => Number(val)),
  low: z.union([z.number(), z.string()]).transform(val => Number(val)),
  high: z.union([z.number(), z.string()]).transform(val => Number(val)),
})

const bulkBaseResistSchema = z.array(baseResistSchema)

export default async function baseResistRoutes(fastify: FastifyInstance) {
  // Get all base resists
  fastify.get('/base-resists', async (_request, reply) => {
    try {
      const baseResists = await models.BaseResist.findAll({
        order: [['level', 'ASC']],
      })
      return reply.send(baseResists)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch base resists' })
    }
  })

  // Get base resist by level
  fastify.get('/base-resists/:level', async (request, reply) => {
    try {
      const { level } = request.params as { level: string }
      const baseResist = await models.BaseResist.findOne({
        where: { level: parseInt(level) },
      })

      if (!baseResist) {
        return reply
          .code(404)
          .send({ error: 'Base resist not found for this level' })
      }

      return reply.send(baseResist)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch base resist' })
    }
  })

  // Create multiple base resists
  fastify.post('/base-resists/bulk', async (request, reply) => {
    try {
      const baseResistsData = bulkBaseResistSchema.parse(request.body)

      // Verificar se já existem registros para os níveis informados
      const levels = baseResistsData.map(resist => resist.level)
      const existingResists = await models.BaseResist.findAll({
        where: { level: levels },
      })

      if (existingResists.length > 0) {
        const existingLevels = existingResists.map(resist => resist.level)
        return reply.code(400).send({
          error: 'Some levels already have base resists defined',
          levels: existingLevels,
        })
      }

      const baseResists = await models.BaseResist.bulkCreate(baseResistsData, {
        returning: true,
      })

      return reply.code(201).send(baseResists)
    } catch (error) {
      fastify.log.error(error)
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Invalid base resist data',
          details: error.errors,
        })
      }
      return reply.code(400).send({ error: 'Failed to create base resists' })
    }
  })

  // Create single base resist
  fastify.post('/base-resists', async (request, reply) => {
    try {
      const baseResistData = baseResistSchema.parse(request.body)

      // Verificar se já existe um registro para este nível
      const existingResist = await models.BaseResist.findOne({
        where: { level: baseResistData.level },
      })

      if (existingResist) {
        return reply
          .code(400)
          .send({ error: 'Base resist already exists for this level' })
      }

      const baseResist = await models.BaseResist.create(baseResistData)
      return reply.code(201).send(baseResist)
    } catch (error) {
      fastify.log.error(error)
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Invalid base resist data',
          details: error.errors,
        })
      }
      return reply.code(400).send({ error: 'Failed to create base resist' })
    }
  })

  // Update base resist
  fastify.put('/base-resists/:level', async (request, reply) => {
    try {
      const { level } = request.params as { level: string }
      const baseResistData = baseResistSchema.parse(request.body)

      const baseResist = await models.BaseResist.findOne({
        where: { level: parseInt(level) },
      })

      if (!baseResist) {
        return reply
          .code(404)
          .send({ error: 'Base resist not found for this level' })
      }

      await baseResist.update(baseResistData)
      return reply.send(baseResist)
    } catch (error) {
      fastify.log.error(error)
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Invalid base resist data',
          details: error.errors,
        })
      }
      return reply.code(400).send({ error: 'Failed to update base resist' })
    }
  })

  // Delete base resist
  fastify.delete('/base-resists/:level', async (request, reply) => {
    try {
      const { level } = request.params as { level: string }
      const baseResist = await models.BaseResist.findOne({
        where: { level: parseInt(level) },
      })

      if (!baseResist) {
        return reply
          .code(404)
          .send({ error: 'Base resist not found for this level' })
      }

      await baseResist.destroy()
      return reply.code(204).send()
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to delete base resist' })
    }
  })
}
