import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import {
  Character,
  Race,
  Alignment,
  Divinity,
  User,
  Portrait,
} from '../models/index.js'

const characterSchema = z.object({
  name: z.string().min(1),
  level: z.number().min(1).max(20),
  race_id: z.number().optional(),
  alignment_id: z.number().optional(),
  divinity_id: z.number().optional(),
  age: z.number().optional(),
  gender: z.number().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  skin: z.string().optional(),
  eye: z.string().optional(),
  hair: z.string().optional(),
  size: z.number().optional(),
  exp: z.number().optional(),
  health: z.number().optional(),
  health_now: z.number().optional(),
})

export default async function characterRoutes(fastify: FastifyInstance) {
  // Get all characters
  fastify.get('/characters', async (request, reply) => {
    try {
      const characters = await Character.findAll({
        include: [
          { model: Race, as: 'race' },
          { model: Alignment, as: 'alignment' },
          { model: Divinity, as: 'divinity' },
          { model: User, as: 'user', attributes: ['id', 'name'] },
          { model: Portrait, as: 'portrait' },
        ],
        where: { is_ativo: true },
        order: [['created_at', 'DESC']],
      })

      // Transform data for frontend compatibility
      const transformedCharacters = characters.map((char: any) => {
        const charData = char.toJSON()
        return {
          ...charData,
          race: charData.race?.name || '',
          alignment: charData.alignment?.name || '',
          divinity: charData.divinity?.name || '',
          user: charData.user?.name || '',
          portrait: charData.portrait?.path
            ? `http://localhost:9600/portrait-files/${charData.portrait.path}`
            : '',
        }
      })

      return reply.send(transformedCharacters)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch characters' })
    }
  })

  // Get character by ID
  fastify.get('/characters/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const character = await Character.findByPk(parseInt(id), {
        include: [
          { model: Race, as: 'race' },
          { model: Alignment, as: 'alignment' },
          { model: Divinity, as: 'divinity' },
          { model: User, as: 'user', attributes: ['id', 'name'] },
          { model: Portrait, as: 'portrait' },
        ],
      })

      if (!character) {
        return reply.code(404).send({ error: 'Character not found' })
      }

      return reply.send(character)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch character' })
    }
  })

  // Create character
  fastify.post('/characters', async (request, reply) => {
    try {
      const characterData = characterSchema.parse(request.body)

      // TODO: Get user_id from JWT token
      // For now, use a default user_id
      const user_id = 1

      const character = await Character.create({
        ...characterData,
        user_id,
        is_ativo: true,
      })

      // Fetch the created character with associations
      const createdCharacter = await Character.findByPk(character.id, {
        include: [
          { model: Race, as: 'race' },
          { model: Alignment, as: 'alignment' },
          { model: Divinity, as: 'divinity' },
          { model: User, as: 'user', attributes: ['id', 'name'] },
          { model: Portrait, as: 'portrait' },
        ],
      })

      return reply.code(201).send(createdCharacter)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create character' })
    }
  })

  // Update character
  fastify.put('/characters/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const characterData = characterSchema.partial().parse(request.body)

      const character = await Character.findByPk(parseInt(id))

      if (!character) {
        return reply.code(404).send({ error: 'Character not found' })
      }

      await character.update(characterData)

      // Fetch updated character with associations
      const updatedCharacter = await Character.findByPk(character.id, {
        include: [
          { model: Race, as: 'race' },
          { model: Alignment, as: 'alignment' },
          { model: Divinity, as: 'divinity' },
          { model: User, as: 'user', attributes: ['id', 'name'] },
          { model: Portrait, as: 'portrait' },
        ],
      })

      return reply.send(updatedCharacter)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to update character' })
    }
  })

  // Delete character (soft delete)
  fastify.delete('/characters/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const character = await Character.findByPk(parseInt(id))

      if (!character) {
        return reply.code(404).send({ error: 'Character not found' })
      }

      await character.update({ is_ativo: false })

      return reply.send({ message: 'Character deleted successfully' })
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to delete character' })
    }
  })
}
