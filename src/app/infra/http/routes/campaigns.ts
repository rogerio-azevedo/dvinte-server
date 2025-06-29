import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import models from '../../db/models'

const campaignSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string(),
  user_id: z.union([z.number(), z.string()]).transform(val => Number(val)),
})

const updateCampaignSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().optional(),
  user_id: z
    .union([z.number(), z.string()])
    .transform(val => Number(val))
    .optional(),
})

export default async function campaignRoutes(fastify: FastifyInstance) {
  // Get all campaigns
  fastify.get('/campaigns', async (_request, reply) => {
    try {
      const campaigns = await models.Campaign.findAll({
        order: [['name', 'ASC']],
      })
      return reply.send(campaigns)
    } catch (error) {
      fastify.log.error('Error fetching campaigns:', error)
      return reply.code(500).send({ error: 'Failed to fetch campaigns' })
    }
  })

  // Get campaign by ID
  fastify.get('/campaigns/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const campaign = await models.Campaign.findByPk(parseInt(id), {
        include: [
          {
            model: models.User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: models.GameMap,
            as: 'gameMap',
            required: false,
          },
        ],
      })

      if (!campaign) {
        return reply.code(404).send({ error: 'Campaign not found' })
      }

      return reply.send(campaign)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch campaign' })
    }
  })

  // Get campaigns by user ID
  fastify.get('/campaigns/user/:userId', async (request, reply) => {
    try {
      const { userId } = request.params as { userId: string }
      const campaigns = await models.Campaign.findAll({
        where: { user_id: parseInt(userId) },
        order: [['name', 'ASC']],
        include: [
          {
            model: models.User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: models.GameMap,
            as: 'gameMap',
            required: false,
          },
        ],
      })

      return reply.send(campaigns)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch user campaigns' })
    }
  })

  // Create new campaign
  fastify.post('/campaigns', async (request, reply) => {
    try {
      const campaignData = campaignSchema.parse(request.body)

      // Verify if user exists
      const user = await models.User.findByPk(campaignData.user_id)
      if (!user) {
        return reply.code(404).send({ error: 'User not found' })
      }

      const campaign = await models.Campaign.create(campaignData)

      // Fetch the campaign with related data
      const campaignWithRelations = await models.Campaign.findByPk(
        campaign.id,
        {
          include: [
            {
              model: models.User,
              as: 'user',
              attributes: ['id', 'name', 'email'],
            },
            {
              model: models.GameMap,
              as: 'gameMap',
              required: false,
            },
          ],
        }
      )

      return reply.code(201).send(campaignWithRelations)
    } catch (error) {
      fastify.log.error(error)
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Invalid campaign data',
          details: error.errors,
        })
      }
      return reply.code(400).send({ error: 'Failed to create campaign' })
    }
  })

  // Update campaign
  fastify.put('/campaigns/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const campaignData = updateCampaignSchema.parse(request.body)

      const campaign = await models.Campaign.findByPk(parseInt(id))
      if (!campaign) {
        return reply.code(404).send({ error: 'Campaign not found' })
      }

      // Verify if user exists (if user_id is being updated)
      if (campaignData.user_id) {
        const user = await models.User.findByPk(campaignData.user_id)
        if (!user) {
          return reply.code(404).send({ error: 'User not found' })
        }
      }

      await campaign.update(campaignData)

      // Fetch the updated campaign with related data
      const updatedCampaign = await models.Campaign.findByPk(campaign.id, {
        include: [
          {
            model: models.User,
            as: 'user',
            attributes: ['id', 'name', 'email'],
          },
          {
            model: models.GameMap,
            as: 'gameMap',
            required: false,
          },
        ],
      })

      return reply.send(updatedCampaign)
    } catch (error) {
      fastify.log.error(error)
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Invalid campaign data',
          details: error.errors,
        })
      }
      return reply.code(400).send({ error: 'Failed to update campaign' })
    }
  })

  // Delete campaign
  fastify.delete('/campaigns/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const campaign = await models.Campaign.findByPk(parseInt(id))

      if (!campaign) {
        return reply.code(404).send({ error: 'Campaign not found' })
      }

      await campaign.destroy()
      return reply.code(204).send()
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to delete campaign' })
    }
  })
}
