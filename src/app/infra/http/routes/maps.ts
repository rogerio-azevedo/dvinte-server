import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import models from '../../db/models'
import { changeMap } from '../../../shared/utils/websocket'

const gameMapSchema = z.object({
  campaign_id: z.union([z.number(), z.string()]).transform(val => Number(val)),
  battle: z.string(),
  world: z.string(),
  width: z
    .union([z.number(), z.string()])
    .transform(val => (val === '' ? 0 : Number(val))),
  height: z
    .union([z.number(), z.string()])
    .transform(val => (val === '' ? 0 : Number(val))),
  grid: z
    .union([z.boolean(), z.string()])
    .transform(val => (typeof val === 'string' ? val === 'true' : val)),
  fog: z
    .union([z.boolean(), z.string()])
    .transform(val => (typeof val === 'string' ? val === 'true' : val)),
  gm_layer: z
    .union([z.boolean(), z.string()])
    .transform(val => (typeof val === 'string' ? val === 'true' : val)),
  owner: z.union([z.number(), z.string()]).transform(val => Number(val)),
})

const updateGameMapSchema = z.object({
  campaign_id: z
    .union([z.number(), z.string()])
    .transform(val => Number(val))
    .optional(),
  battle: z.string().nullable().optional(),
  world: z.string().nullable().optional(),
  width: z
    .union([z.number(), z.string()])
    .transform(val => Number(val))
    .optional(),
  height: z
    .union([z.number(), z.string()])
    .transform(val => Number(val))
    .optional(),
  grid: z
    .union([z.boolean(), z.string()])
    .transform(val => (typeof val === 'string' ? val === 'true' : val))
    .optional(),
  fog: z
    .union([z.boolean(), z.string()])
    .transform(val => (typeof val === 'string' ? val === 'true' : val))
    .optional(),
  gm_layer: z
    .union([z.boolean(), z.string()])
    .transform(val => (typeof val === 'string' ? val === 'true' : val))
    .optional(),
  owner: z
    .union([z.number(), z.string()])
    .transform(val => Number(val))
    .optional(),
})

export default async function mapRoutes(fastify: FastifyInstance) {
  // Get all maps
  fastify.get('/maps', async (_request, reply) => {
    try {
      const maps = await models.GameMap.findAll({
        order: [['created_at', 'DESC']],
      })
      return reply.send(maps)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch maps' })
    }
  })

  // Get map by campaign ID (legado compatibility - /:id era campaign_id)
  fastify.get('/maps/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const map = await models.GameMap.findOne({
        where: { campaign_id: parseInt(id) },
      })

      if (!map) {
        return reply
          .code(404)
          .send({ error: 'Map not found for this campaign' })
      }

      return reply.send(map)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch map' })
    }
  })

  // Get map by actual map ID
  fastify.get('/maps/id/:mapId', async (request, reply) => {
    try {
      const { mapId } = request.params as { mapId: string }

      const map = await models.GameMap.findByPk(parseInt(mapId), {
        include: [
          {
            model: models.Campaign,
            as: 'campaign',
            include: [
              {
                model: models.User,
                as: 'user',
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
      })

      if (!map) {
        return reply.code(404).send({ error: 'Map not found' })
      }

      return reply.send(map)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch map' })
    }
  })

  // Get map by campaign ID (explicit route)
  fastify.get('/maps/campaign/:campaignId', async (request, reply) => {
    try {
      const { campaignId } = request.params as { campaignId: string }
      const map = await models.GameMap.findOne({
        where: { campaign_id: parseInt(campaignId) },
        include: [
          {
            model: models.Campaign,
            as: 'campaign',
            include: [
              {
                model: models.User,
                as: 'user',
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
      })

      if (!map) {
        return reply
          .code(404)
          .send({ error: 'Map not found for this campaign' })
      }

      return reply.send(map)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch map' })
    }
  })

  // Create or update map (seguindo o padrão do legado)
  fastify.post('/maps', async (request, reply) => {
    try {
      fastify.log.info('📋 Request body received:', request.body)

      const mapData = gameMapSchema.parse(request.body)
      fastify.log.info('✅ Schema validation passed:', mapData)

      // Verify if campaign exists, create default for user if needed
      let campaign = await models.Campaign.findByPk(mapData.campaign_id)

      if (!campaign) {
        fastify.log.info(
          `🔍 Campaign ${mapData.campaign_id} not found, checking if user has any campaigns`
        )

        // Check if user exists first
        const user = await models.User.findByPk(mapData.owner)
        if (!user) {
          fastify.log.error(`❌ User not found: ${mapData.owner}`)
          return reply.code(404).send({ error: 'User not found' })
        }

        // Check if user has any existing campaigns
        const userCampaigns = await models.Campaign.findAll({
          where: { user_id: mapData.owner },
          limit: 1,
        })

        if (userCampaigns.length > 0) {
          // User has campaigns but provided wrong ID
          fastify.log.error(
            `❌ Invalid campaign ID ${mapData.campaign_id} for user ${mapData.owner}`
          )
          return reply.code(404).send({
            error: 'Campaign not found. Please select a valid campaign.',
            userCampaigns: userCampaigns.map(c => ({ id: c.id, name: c.name })),
          })
        }

        // User has no campaigns, create a default one
        fastify.log.info(`🆕 Creating default campaign for user ${user.name}`)
        try {
          campaign = await models.Campaign.create({
            name: `Campanha de ${user.name}`,
            description: 'Campanha criada automaticamente para mapas',
            user_id: mapData.owner,
          })
          fastify.log.info('✅ Default campaign created:', campaign.id)

          // Update mapData to use the new campaign ID
          mapData.campaign_id = campaign.id
        } catch (campaignError) {
          fastify.log.error(
            '❌ Failed to create default campaign:',
            campaignError
          )
          return reply
            .code(500)
            .send({ error: 'Failed to create default campaign' })
        }
      }

      fastify.log.info('✅ Campaign available:', campaign.id)

      // Check if map already exists for this campaign
      const existingMap = await models.GameMap.findOne({
        where: { campaign_id: mapData.campaign_id },
      })
      fastify.log.info(
        '🔍 Existing map:',
        existingMap ? existingMap.id : 'none'
      )

      let map
      if (!existingMap) {
        // Create new map
        fastify.log.info('🆕 Creating new map with data:', mapData)
        map = await models.GameMap.create(mapData)
        fastify.log.info('✅ New map created:', map.id)
      } else {
        // Update existing map
        fastify.log.info('🔄 Updating existing map with data:', mapData)
        await existingMap.update(mapData)
        map = existingMap
        fastify.log.info('✅ Map updated:', map.id)

        // Notify clients about map update via WebSocket
        try {
          changeMap(mapData)
          fastify.log.info('📡 WebSocket notification sent')
        } catch (wsError) {
          fastify.log.error('❌ WebSocket notification failed:', wsError)
          // Don't fail the whole request for WebSocket errors
        }
      }

      // Fetch the map with related data
      try {
        const mapWithRelations = await models.GameMap.findByPk(map.id, {
          include: [
            {
              model: models.Campaign,
              as: 'campaign',
              include: [
                {
                  model: models.User,
                  as: 'user',
                  attributes: ['id', 'name'],
                },
              ],
            },
          ],
        })
        fastify.log.info('✅ Map with relations fetched successfully')

        return reply.code(existingMap ? 200 : 201).send(mapWithRelations)
      } catch (relationError) {
        fastify.log.error(
          '❌ Error fetching relations, returning simple map:',
          relationError
        )
        // If relations fail, return simple map
        return reply.code(existingMap ? 200 : 201).send(map)
      }
    } catch (error) {
      fastify.log.error('❌ Error in POST /maps:', error)

      if (error instanceof z.ZodError) {
        fastify.log.error('❌ Zod validation error:', error.errors)
        return reply.code(400).send({
          error: 'Invalid map data',
          details: error.errors,
        })
      }

      // Log specific database errors
      const err = error as any
      if (err.name === 'SequelizeValidationError') {
        fastify.log.error('❌ Sequelize validation error:', err.errors)
        return reply.code(400).send({
          error: 'Database validation error',
          details: err.errors,
        })
      }

      if (err.name === 'SequelizeForeignKeyConstraintError') {
        fastify.log.error('❌ Foreign key constraint error:', err.message)
        return reply.code(400).send({
          error: 'Foreign key constraint error',
          details: err.message,
        })
      }

      return reply.code(500).send({
        error: 'Failed to create/update map',
        details: err.message || 'Unknown error',
      })
    }
  })

  // Update map by ID
  fastify.put('/maps/id/:mapId', async (request, reply) => {
    try {
      const { mapId } = request.params as { mapId: string }
      const mapData = updateGameMapSchema.parse(request.body)

      const map = await models.GameMap.findByPk(parseInt(mapId))
      if (!map) {
        return reply.code(404).send({ error: 'Map not found' })
      }

      // Verify if campaign exists (if campaign_id is being updated)
      if (mapData.campaign_id) {
        const campaign = await models.Campaign.findByPk(mapData.campaign_id)
        if (!campaign) {
          return reply.code(404).send({ error: 'Campaign not found' })
        }
      }

      await map.update(mapData)

      // Notify clients about map update via WebSocket
      changeMap(mapData)

      // Fetch the updated map with related data
      const updatedMap = await models.GameMap.findByPk(map.id, {
        include: [
          {
            model: models.Campaign,
            as: 'campaign',
            include: [
              {
                model: models.User,
                as: 'user',
                attributes: ['id', 'name'],
              },
            ],
          },
        ],
      })

      return reply.send(updatedMap)
    } catch (error) {
      fastify.log.error(error)
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Invalid map data',
          details: error.errors,
        })
      }
      return reply.code(500).send({ error: 'Failed to update map' })
    }
  })

  // Delete map by ID
  fastify.delete('/maps/id/:mapId', async (request, reply) => {
    try {
      const { mapId } = request.params as { mapId: string }
      const map = await models.GameMap.findByPk(parseInt(mapId))

      if (!map) {
        return reply.code(404).send({ error: 'Map not found' })
      }

      await map.destroy()
      return reply.code(204).send()
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to delete map' })
    }
  })

  // Delete map by campaign ID
  fastify.delete('/maps/campaign/:campaignId', async (request, reply) => {
    try {
      const { campaignId } = request.params as { campaignId: string }
      const map = await models.GameMap.findOne({
        where: { campaign_id: parseInt(campaignId) },
      })

      if (!map) {
        return reply
          .code(404)
          .send({ error: 'Map not found for this campaign' })
      }

      await map.destroy()
      return reply.code(204).send()
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to delete map' })
    }
  })
}
