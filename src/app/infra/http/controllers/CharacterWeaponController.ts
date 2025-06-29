import { FastifyRequest, FastifyReply } from 'fastify'
import models from '../../../infra/db/models'

interface CharacterWeaponBody {
  character: number
  weapon: number
  hit: number
  damage: number
  element: number
  crit_mod: number
  crit_from_mod: number
  dex_damage: boolean
  price: number
  nickname?: string
  description?: string
}

class CharacterWeaponController {
  async store(
    request: FastifyRequest<{ Body: CharacterWeaponBody }>,
    reply: FastifyReply
  ) {
    try {
      const weaponChar = {
        character_id: request.body.character,
        weapon_id: Number(request.body.weapon),
        hit: Number(request.body.hit),
        damage: Number(request.body.damage),
        element: Number(request.body.element),
        crit_mod: Number(request.body.crit_mod),
        crit_from_mod: Number(request.body.crit_from_mod),
        dex_damage: request.body.dex_damage || false,
        price: Number(request.body.price),
        nickname: request.body.nickname,
        description: request.body.description,
      }

      const weapon = await models.CharacterWeapon.create(weaponChar)

      return reply.send(weapon)
    } catch (error) {
      request.log.error('Error creating character weapon:', error)
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
      const weaponId = Number(request.params.id)

      await models.CharacterWeapon.destroy({
        where: {
          character_id: charId,
          weapon_id: weaponId,
        },
      })

      return reply.status(200).send()
    } catch (error) {
      request.log.error('Error deleting character weapon:', error)
      return reply.status(500).send({ error: 'Internal server error' })
    }
  }
}

export default new CharacterWeaponController()
