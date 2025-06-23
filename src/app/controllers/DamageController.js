import Logs from '../schemas/Logs'

// import { saveMessage } from '../../websocket'

const { format, subDays, addDays, parseISO } = require('date-fns')
const { utcToZonedTime } = require('date-fns-tz')

const DateBR = utcToZonedTime(new Date(), 'America/Sao_Paulo')
const date2 = addDays(DateBR, 1)

class DamageController {
  async index(req, res) {
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

    const data2 = format(date2, "yyyy-MM-dd'T23:59:59")
    const { type } = req.query

    let match = {}

    if (type === 'combat') {
      match = {
        $match: {
          type: 4,
          createdAt: {
            $gte:
              combatStart.length > 0 ? combatStart[0].createdAt : new Date(),
            $lte: parseISO(data2),
          },
        },
      }
    } else {
      match = {
        $match: {
          type: 4,
          createdAt: {
            $gte:
              sessionStart.length > 0 ? sessionStart[0].createdAt : new Date(),
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

    return res.json(damages)
  }
}

export default new DamageController()
