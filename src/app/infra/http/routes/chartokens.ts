import { FastifyInstance } from 'fastify'
import models from '../../db/models'
import { updateToken } from '../../../shared/utils/websocket.js'

export default async function charTokenRoutes(fastify: FastifyInstance) {
  // Get all character tokens
  fastify.get('/chartokens', async (request, reply) => {
    try {
      const characterTokens = await models.CharacterToken.findAll({
        attributes: [
          'id',
          'character_id',
          'token_id',
          'x',
          'y',
          'width',
          'height',
          'rotation',
          'enabled',
        ],
        include: [
          {
            model: models.Token,
            as: 'tokens',
            attributes: ['id', 'name', 'path', 'url'],
          },
          {
            model: models.Character,
            as: 'character',
            attributes: ['id', 'name', 'level'],
          },
        ],
      })

      const tokens = characterTokens.map(t => ({
        id: t.id,
        character_id: t.character_id,
        token_id: t.token_id,
        x: t.x,
        y: t.y,
        width: t.width,
        height: t.height,
        rotation: t.rotation,
        enabled: t.enabled,
        image: t.tokens?.url,
        tokens: t.tokens,
        character: t.character,
        created_at: t.created_at,
        updated_at: t.updated_at,
      }))

      return reply.send(tokens)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch character tokens' })
    }
  })

  // Get character token by ID
  fastify.get('/chartokens/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const characterToken = await models.CharacterToken.findByPk(id, {
        include: [
          {
            model: models.Token,
            as: 'tokens',
            attributes: ['id', 'name', 'path', 'url'],
          },
          {
            model: models.Character,
            as: 'character',
            attributes: ['id', 'name', 'level'],
          },
        ],
      })

      if (!characterToken) {
        return reply.code(404).send({ error: 'Character token not found' })
      }

      const token = {
        id: characterToken.id,
        character_id: characterToken.character_id,
        token_id: characterToken.token_id,
        x: characterToken.x,
        y: characterToken.y,
        width: characterToken.width,
        height: characterToken.height,
        rotation: characterToken.rotation,
        enabled: characterToken.enabled,
        image: characterToken.tokens?.url,
        tokens: characterToken.tokens,
        character: characterToken.character,
        created_at: characterToken.created_at,
        updated_at: characterToken.updated_at,
      }

      return reply.send(token)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch character token' })
    }
  })

  // Create new character token
  fastify.post('/chartokens', async (request, reply) => {
    try {
      const {
        character_id,
        token_id,
        x = 250,
        y = 250,
        width = 90,
        height = 90,
        rotation = 90,
        enabled = false,
      } = request.body as {
        character_id: number
        token_id: number
        x?: number
        y?: number
        width?: number
        height?: number
        rotation?: number
        enabled?: boolean
      }

      fastify.log.info('Creating new character token:', {
        character_id,
        token_id,
        x,
        y,
        width,
        height,
        rotation,
        enabled,
      })

      const characterToken = await models.CharacterToken.create({
        character_id,
        token_id,
        x: parseFloat(x.toFixed(2)),
        y: parseFloat(y.toFixed(2)),
        width: parseFloat(width.toFixed(2)),
        height: parseFloat(height.toFixed(2)),
        rotation: parseFloat(rotation.toFixed(2)),
        enabled,
      })

      fastify.log.info(`Character token created with ID: ${characterToken.id}`)
      return reply.code(201).send(characterToken)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to create character token' })
    }
  })

  // Update character token position (without ID in URL - for drag and drop)
  fastify.put('/chartokens', async (request, reply) => {
    try {
      const { id, x, y, width, height, rotation, enabled } = request.body as {
        id: number
        x?: number
        y?: number
        width?: number
        height?: number
        rotation?: number
        enabled?: boolean
      }

      fastify.log.info(`Updating token ${id}:`, {
        x,
        y,
        width,
        height,
        rotation,
        enabled,
      })

      const characterToken = await models.CharacterToken.findByPk(id)

      if (!characterToken) {
        return reply.code(404).send({ error: 'Character token not found' })
      }

      // Update token properties
      const updateData: any = {}
      if (x !== undefined) updateData.x = parseFloat(x.toFixed(2))
      if (y !== undefined) updateData.y = parseFloat(y.toFixed(2))
      if (width !== undefined) updateData.width = parseFloat(width.toFixed(2))
      if (height !== undefined)
        updateData.height = parseFloat(height.toFixed(2))
      if (rotation !== undefined)
        updateData.rotation = parseFloat(rotation.toFixed(2))
      if (enabled !== undefined) updateData.enabled = enabled

      await characterToken.update(updateData)

      // Get updated list of all tokens
      const allTokens = await models.CharacterToken.findAll({
        attributes: [
          'id',
          'character_id',
          'x',
          'y',
          'width',
          'height',
          'rotation',
          'enabled',
        ],
        include: [
          {
            model: models.Token,
            as: 'tokens',
            attributes: ['id', 'name', 'path', 'url'],
          },
          {
            model: models.Character,
            as: 'character',
            attributes: ['id', 'name', 'level'],
          },
        ],
      })

      const tokens = allTokens.map(t => ({
        id: t.id,
        character_id: t.character_id,
        token_id: t.token_id,
        x: t.x,
        y: t.y,
        width: t.width,
        height: t.height,
        rotation: t.rotation,
        enabled: t.enabled,
        image: t.tokens?.url,
        tokens: t.tokens,
        character: t.character,
        created_at: t.created_at,
        updated_at: t.updated_at,
      }))

      // Broadcast token update via WebSocket to sync with all connected users
      updateToken(tokens)
      fastify.log.info(`Token ${id} updated and broadcasted via WebSocket`)
      return reply.send(characterToken)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to update character token' })
    }
  })

  // Update character token position (with ID in URL - alternative route)
  fastify.put('/chartokens/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { x, y, width, height, rotation, enabled } = request.body as {
        x?: number
        y?: number
        width?: number
        height?: number
        rotation?: number
        enabled?: boolean
      }

      const characterToken = await models.CharacterToken.findByPk(id)

      if (!characterToken) {
        return reply.code(404).send({ error: 'Character token not found' })
      }

      // Update token properties
      const updateData: any = {}
      if (x !== undefined) updateData.x = parseFloat(x.toFixed(2))
      if (y !== undefined) updateData.y = parseFloat(y.toFixed(2))
      if (width !== undefined) updateData.width = parseFloat(width.toFixed(2))
      if (height !== undefined)
        updateData.height = parseFloat(height.toFixed(2))
      if (rotation !== undefined)
        updateData.rotation = parseFloat(rotation.toFixed(2))
      if (enabled !== undefined) updateData.enabled = enabled

      await characterToken.update(updateData)

      // Get updated list of all tokens
      const allTokens = await models.CharacterToken.findAll({
        attributes: [
          'id',
          'character_id',
          'x',
          'y',
          'width',
          'height',
          'rotation',
          'enabled',
        ],
        include: [
          {
            model: models.Token,
            as: 'tokens',
            attributes: ['id', 'name', 'path', 'url'],
          },
          {
            model: models.Character,
            as: 'character',
            attributes: ['id', 'name', 'level'],
          },
        ],
      })

      const tokens = allTokens.map(t => ({
        id: t.id,
        character_id: t.character_id,
        token_id: t.token_id,
        x: t.x,
        y: t.y,
        width: t.width,
        height: t.height,
        rotation: t.rotation,
        enabled: t.enabled,
        image: t.tokens?.url,
        tokens: t.tokens,
        character: t.character,
        created_at: t.created_at,
        updated_at: t.updated_at,
      }))

      // Broadcast token update via WebSocket to sync with all connected users
      updateToken(tokens)
      fastify.log.info(`Token ${id} updated and broadcasted via WebSocket`)

      return reply.send(characterToken)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to update character token' })
    }
  })
}
