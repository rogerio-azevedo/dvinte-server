import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import models from '../../db/models'

const attributeTempSchema = z.object({
  character_id: z.union([z.number(), z.string()]).transform(val => Number(val)),
  strength: z.union([z.number(), z.string()]).transform(val => Number(val)),
  dexterity: z.union([z.number(), z.string()]).transform(val => Number(val)),
  constitution: z.union([z.number(), z.string()]).transform(val => Number(val)),
  intelligence: z.union([z.number(), z.string()]).transform(val => Number(val)),
  wisdom: z.union([z.number(), z.string()]).transform(val => Number(val)),
  charisma: z.union([z.number(), z.string()]).transform(val => Number(val)),
})

const attributeTempUpdateSchema = z.object({
  str: z.union([z.number(), z.string()]).transform(val => Number(val)),
  con: z.union([z.number(), z.string()]).transform(val => Number(val)),
})

export default async function attributeTempRoutes(fastify: FastifyInstance) {
  // Get all temporary attributes
  fastify.get('/attributes-temp', async (_request, reply) => {
    try {
      const attributesTemp = await models.AttributeTemp.findAll()
      return reply.send(attributesTemp)
    } catch (error) {
      fastify.log.error(error)
      return reply
        .code(500)
        .send({ error: 'Failed to fetch temporary attributes' })
    }
  })

  // Get temporary attributes by character ID
  fastify.get('/attributes-temp/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const attributeTemp = await models.AttributeTemp.findOne({
        where: { character_id: parseInt(id) },
      })

      if (!attributeTemp) {
        return reply
          .code(404)
          .send({ error: 'Temporary attributes not found for this character' })
      }

      return reply.send(attributeTemp)
    } catch (error) {
      fastify.log.error(error)
      return reply
        .code(500)
        .send({ error: 'Failed to fetch temporary attributes' })
    }
  })

  // Create new temporary attributes
  fastify.post('/attributes-temp', async (request, reply) => {
    try {
      const attributeTempData = attributeTempSchema.parse(request.body)

      // Verify if character exists
      const character = await models.Character.findByPk(
        attributeTempData.character_id
      )
      if (!character) {
        return reply.code(404).send({ error: 'Character not found' })
      }

      // Check if character already has temporary attributes
      const existingAttributeTemp = await models.AttributeTemp.findOne({
        where: { character_id: attributeTempData.character_id },
      })

      if (existingAttributeTemp) {
        return reply
          .code(400)
          .send({ error: 'Character already has temporary attributes' })
      }

      const attributeTemp = await models.AttributeTemp.create(attributeTempData)
      return reply.code(201).send(attributeTemp)
    } catch (error) {
      fastify.log.error(error)
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Invalid temporary attribute data',
          details: error.errors,
        })
      }
      return reply
        .code(400)
        .send({ error: 'Failed to create temporary attributes' })
    }
  })

  // Update temporary attributes
  fastify.put('/attributes-temp/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const updateData = attributeTempUpdateSchema.parse(request.body)

      const attributeTemp = await models.AttributeTemp.findOne({
        where: { character_id: parseInt(id) },
      })

      if (!attributeTemp) {
        return reply
          .code(404)
          .send({ error: 'Temporary attributes not found for this character' })
      }

      // Seguindo a lógica do legado: apenas atualiza força e constituição
      const updatedData = {
        character_id: attributeTemp.character_id,
        strength: attributeTemp.strength + updateData.str,
        dexterity: attributeTemp.dexterity,
        constitution: attributeTemp.constitution + updateData.con,
        intelligence: attributeTemp.intelligence,
        wisdom: attributeTemp.wisdom,
        charisma: attributeTemp.charisma,
      }

      await attributeTemp.update(updatedData)
      return reply.send(attributeTemp)
    } catch (error) {
      fastify.log.error(error)
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Invalid update data',
          details: error.errors,
        })
      }
      return reply
        .code(400)
        .send({ error: 'Failed to update temporary attributes' })
    }
  })

  // Delete temporary attributes
  fastify.delete('/attributes-temp/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const attributeTemp = await models.AttributeTemp.findOne({
        where: { character_id: parseInt(id) },
      })

      if (!attributeTemp) {
        return reply
          .code(404)
          .send({ error: 'Temporary attributes not found for this character' })
      }

      await attributeTemp.destroy()
      return reply.code(204).send()
    } catch (error) {
      fastify.log.error(error)
      return reply
        .code(500)
        .send({ error: 'Failed to delete temporary attributes' })
    }
  })
}
