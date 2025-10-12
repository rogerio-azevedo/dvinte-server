import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import models from '../../db/models'

const characterArmorSchema = z.object({
  character_id: z.union([z.number(), z.string()]).transform(val => Number(val)),
  armor_id: z.union([z.number(), z.string()]).transform(val => Number(val)),
  defense: z
    .union([z.number(), z.string(), z.null()])
    .transform(val => Number(val || 0)),
  price: z
    .union([z.number(), z.string(), z.null()])
    .transform(val => Number(val || 0)),
  description: z
    .string()
    .nullish()
    .transform(val => val || ''),
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

  // Update armor
  fastify.put('/armors/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const armorData = request.body as any

      const armor = await models.Armor.findByPk(parseInt(id))

      if (!armor) {
        return reply.code(404).send({ error: 'Armor not found' })
      }

      // Normaliza os valores numéricos: converte string vazia para 0
      const normalizedData = {
        ...armorData,
        name: armorData.name.toUpperCase(),
        type: Number(armorData.type) || 0,
        bonus: Number(armorData.bonus) || 0,
        dexterity: Number(armorData.dexterity) || 0,
        penalty: Number(armorData.penalty) || 0,
        magic: Number(armorData.magic) || 0,
        displacement_s: Number(armorData.displacement_s) || 0,
        displacement_m: Number(armorData.displacement_m) || 0,
        weight: Number(armorData.weight) || 0,
        price: Number(armorData.price) || 0,
      }

      await armor.update(normalizedData)

      return reply.send(armor)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to update armor' })
    }
  })

  // Delete armor
  fastify.delete('/armors/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const armor = await models.Armor.findByPk(parseInt(id))

      if (!armor) {
        return reply.code(404).send({ error: 'Armor not found' })
      }

      await armor.destroy()

      return reply.code(204).send()
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to delete armor' })
    }
  })

  // Add armor to character
  fastify.post('/characters/:characterId/armors', async (request, reply) => {
    try {
      const { characterId } = request.params as { characterId: string }

      // Log mais detalhado do request
      fastify.log.info('Request headers:', request.headers)
      fastify.log.info('Request body (raw):', request.body)
      fastify.log.info(
        'Request body (stringified):',
        JSON.stringify(request.body)
      )

      // Garantir que o body não está vazio
      if (!request.body) {
        return reply.code(400).send({ error: 'Request body is required' })
      }

      const armorData = characterArmorSchema.parse(request.body)

      // Log the parsed data
      fastify.log.info('Parsed armor data:', armorData)

      // Verify if character exists
      const character = await models.Character.findByPk(characterId)
      if (!character) {
        return reply.code(404).send({ error: 'Character not found' })
      }

      // Verify if armor exists
      const armor = await models.Armor.findByPk(armorData.armor_id)
      if (!armor) {
        return reply.code(404).send({ error: 'Armor not found' })
      }

      // Log antes de criar
      fastify.log.info('Creating character armor with data:', {
        character_id: Number(armorData.character_id),
        armor_id: armorData.armor_id,
        defense: armorData.defense,
        price: armorData.price,
        description: armorData.description,
      })

      // Create character armor association
      const characterArmor = await models.CharacterArmor.create({
        character_id: Number(armorData.character_id),
        armor_id: armorData.armor_id,
        defense: armorData.defense,
        price: armorData.price,
        description: armorData.description,
      })

      return reply.code(201).send(characterArmor)
    } catch (error: any) {
      // Log mais detalhado do erro
      fastify.log.error('Error details:', {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
      })

      if (error instanceof z.ZodError) {
        fastify.log.error(
          'Validation errors:',
          JSON.stringify(error.errors, null, 2)
        )
        return reply.code(400).send({
          error: 'Invalid armor data',
          details: error.errors,
        })
      }

      // Log do erro SQL se for um erro do Sequelize
      if (
        error?.name === 'SequelizeError' ||
        error?.name === 'SequelizeDatabaseError'
      ) {
        fastify.log.error('Database error:', {
          name: error?.name,
          message: error?.message,
          sql: error?.sql,
          parameters: error?.parameters,
        })
      }

      return reply.code(500).send({
        error: 'Failed to add armor to character',
        details: error?.message || 'Unknown error',
      })
    }
  })

  // Remove armor from character
  fastify.delete(
    '/characters/:characterId/armors/:armorId',
    async (request, reply) => {
      try {
        const { characterId, armorId } = request.params as {
          characterId: string
          armorId: string
        }

        const result = await models.CharacterArmor.destroy({
          where: {
            character_id: parseInt(characterId),
            armor_id: parseInt(armorId),
          },
        })

        if (result === 0) {
          return reply
            .code(404)
            .send({ error: 'Character armor association not found' })
        }

        fastify.log.info(
          `Armor ${armorId} removed from character ${characterId}`
        )
        return reply.code(204).send()
      } catch (error) {
        fastify.log.error('Error removing armor from character:', error)
        return reply.code(500).send({
          error: 'Failed to remove armor from character',
          details: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )
}
