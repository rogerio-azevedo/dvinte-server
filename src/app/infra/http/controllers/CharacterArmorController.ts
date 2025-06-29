import { FastifyRequest, FastifyReply } from 'fastify'
import models from '../../../infra/db/models'

interface CharacterArmorBody {
  character: number
  armor: number
  defense: number
  price: number
  description?: string
}

class CharacterArmorController {
  async store(
    request: FastifyRequest<{ Body: CharacterArmorBody }>,
    reply: FastifyReply
  ) {
    try {
      const armorChar = {
        character_id: request.body.character,
        armor_id: Number(request.body.armor),
        defense: Number(request.body.defense),
        price: Number(request.body.price),
        description: request.body.description,
      }

      const armor = await models.CharacterArmor.create(armorChar)

      return reply.send(armor)
    } catch (error) {
      request.log.error('Error creating character armor:', error)
      return reply.status(500).send({ error: 'Internal server error' })
    }
  }

  async destroy(
    request: FastifyRequest<{
      Params: { id: string }
      Querystring: { char: string }
    }>,
    reply: FastifyReply
  ) {
    try {
      const charId = Number(request.query.char)
      const armorId = Number(request.params.id)

      await models.CharacterArmor.destroy({
        where: {
          character_id: charId,
          armor_id: armorId,
        },
      })

      return reply.status(200).send()
    } catch (error) {
      request.log.error('Error deleting character armor:', error)
      return reply.status(500).send({ error: 'Internal server error' })
    }
  }
}

export default new CharacterArmorController()
