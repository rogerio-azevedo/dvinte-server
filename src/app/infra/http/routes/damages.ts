import { FastifyInstance } from 'fastify'
import { Logs } from '../../db/schemas/index'
import { format, addDays, parseISO } from 'date-fns'

export default async function damagesRoutes(fastify: FastifyInstance) {
  fastify.get('/damages', async (request, reply) => {
    try {
      // Busca a última mensagem de início de sessão
      const sessionStart = await Logs.aggregate([
        {
          $match: { type: 0 },
        },
        {
          $project: {
            _id: 0,
            createdAt: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: 1,
        },
      ])

      // Busca a última mensagem de início de combate
      const combatStart = await Logs.aggregate([
        {
          $match: { type: { $in: [8, 10] } },
        },
        {
          $project: {
            _id: 0,
            createdAt: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: 1,
        },
      ])

      const { type } = request.query as { type?: string }
      const now = new Date()
      const data2 = format(addDays(now, 1), "yyyy-MM-dd'T23:59:59")

      let match: any = {}
      if (type === 'combat') {
        match = {
          $match: {
            type: 4,
            createdAt: {
              $gte: combatStart.length > 0 ? combatStart[0].createdAt : now,
              $lte: parseISO(data2),
            },
          },
        }
      } else {
        match = {
          $match: {
            type: 4,
            createdAt: {
              $gte: sessionStart.length > 0 ? sessionStart[0].createdAt : now,
              $lte: parseISO(data2),
            },
          },
        }
      }

      const group = {
        $group: {
          _id: { user: '$user' },
          damage: {
            $sum: '$result',
          },
        },
      }

      const project = {
        $project: {
          _id: 0,
          user: '$_id.user',
          damage: '$damage',
        },
      }

      const pipeline = [match, group, project]
      const damages = await Logs.aggregate(pipeline)

      return reply.send(damages)
    } catch (error) {
      fastify.log.error('Error fetching damage stats:', error)
      return reply.code(500).send({ error: 'Failed to fetch damage stats' })
    }
  })
}
