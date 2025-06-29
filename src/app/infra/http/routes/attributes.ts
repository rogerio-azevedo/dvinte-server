import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import models from '../../db/models'

const attributeSchema = z.object({
  character_id: z.union([z.number(), z.string()]).transform(val => Number(val)),
  strength: z.union([z.number(), z.string()]).transform(val => Number(val)),
  dexterity: z.union([z.number(), z.string()]).transform(val => Number(val)),
  constitution: z.union([z.number(), z.string()]).transform(val => Number(val)),
  intelligence: z.union([z.number(), z.string()]).transform(val => Number(val)),
  wisdom: z.union([z.number(), z.string()]).transform(val => Number(val)),
  charisma: z.union([z.number(), z.string()]).transform(val => Number(val)),
})

export default async function attributeRoutes(fastify: FastifyInstance) {
  // Get all attributes
  fastify.get('/attributes', async (_request, reply) => {
    try {
      const attributes = await models.Attribute.findAll()
      return reply.send(attributes)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch attributes' })
    }
  })

  // Get attribute by ID
  fastify.get('/attributes/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const attribute = await models.Attribute.findByPk(parseInt(id))

      if (!attribute) {
        return reply.code(404).send({ error: 'Attribute not found' })
      }

      return reply.send(attribute)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch attribute' })
    }
  })

  // Create new attribute
  fastify.post('/attributes', async (request, reply) => {
    try {
      const attributeData = attributeSchema.parse(request.body)

      // Verify if character exists
      const character = await models.Character.findByPk(
        attributeData.character_id
      )
      if (!character) {
        return reply.code(404).send({ error: 'Character not found' })
      }

      // Check if character already has attributes
      const existingAttribute = await models.Attribute.findOne({
        where: { character_id: attributeData.character_id },
      })

      if (existingAttribute) {
        return reply
          .code(400)
          .send({ error: 'Character already has attributes' })
      }

      const attribute = await models.Attribute.create(attributeData)
      return reply.code(201).send(attribute)
    } catch (error) {
      fastify.log.error(error)
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Invalid attribute data',
          details: error.errors,
        })
      }
      return reply.code(400).send({ error: 'Failed to create attribute' })
    }
  })

  // Update attribute
  fastify.put('/attributes/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const attributeData = attributeSchema.parse(request.body)

      const attribute = await models.Attribute.findByPk(parseInt(id))
      if (!attribute) {
        return reply.code(404).send({ error: 'Attribute not found' })
      }

      await attribute.update(attributeData)
      return reply.send(attribute)
    } catch (error) {
      fastify.log.error(error)
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Invalid attribute data',
          details: error.errors,
        })
      }
      return reply.code(400).send({ error: 'Failed to update attribute' })
    }
  })

  // Delete attribute
  fastify.delete('/attributes/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const attribute = await models.Attribute.findByPk(parseInt(id))

      if (!attribute) {
        return reply.code(404).send({ error: 'Attribute not found' })
      }

      await attribute.destroy()
      return reply.code(204).send()
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to delete attribute' })
    }
  })
}
