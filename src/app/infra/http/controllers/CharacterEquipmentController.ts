import { FastifyReply, FastifyRequest } from 'fastify'
import models from '../../../infra/db/models'

interface StoreRequest {
  Params: {
    id: string
  }
  Body: {
    equipment: number
    description?: string
  }
}

interface DestroyRequest {
  Params: {
    id: string
  }
  Querystring: {
    char: string
  }
}

class CharacterEquipmentController {
  async store(request: FastifyRequest<StoreRequest>, reply: FastifyReply) {
    try {
      const characterId = Number(request.params.id)
      const { equipment: equipmentId, description } = request.body

      const equipment = await models.Equipment.findOne({
        where: {
          id: equipmentId,
        },
      })

      if (!equipment) {
        return reply.status(404).send({ error: 'Equipment not found' })
      }

      const existingLink = await models.CharacterEquipment.findOne({
        where: {
          character_id: characterId,
          equipment_id: equipmentId,
        },
      })

      if (existingLink) {
        return reply.status(400).send({
          error: 'Este equipamento já está vinculado a este personagem',
        })
      }

      const characterEquipment = await models.CharacterEquipment.create({
        character_id: characterId,
        equipment_id: equipmentId,
        description: description || null,
      })

      const baseAttrs = await models.Attribute.findOne({
        where: {
          character_id: characterId,
        },
      })

      if (!baseAttrs) {
        return reply
          .status(404)
          .send({ error: 'Character attributes not found' })
      }

      const allCharacterEquipments = await models.CharacterEquipment.findAll({
        where: {
          character_id: characterId,
        },
      })

      let totalStrBonus = 0
      let totalDexBonus = 0
      let totalConBonus = 0
      let totalIntBonus = 0
      let totalWisBonus = 0
      let totalChaBonus = 0

      for (const charEquip of allCharacterEquipments) {
        const equip = await models.Equipment.findByPk(charEquip.equipment_id)
        if (equip) {
          totalStrBonus += equip.str_temp || 0
          totalDexBonus += equip.dex_temp || 0
          totalConBonus += equip.con_temp || 0
          totalIntBonus += equip.int_temp || 0
          totalWisBonus += equip.wis_temp || 0
          totalChaBonus += equip.cha_temp || 0
        }
      }

      const newValues = {
        strength: baseAttrs.strength + totalStrBonus,
        dexterity: baseAttrs.dexterity + totalDexBonus,
        constitution: baseAttrs.constitution + totalConBonus,
        intelligence: baseAttrs.intelligence + totalIntBonus,
        wisdom: baseAttrs.wisdom + totalWisBonus,
        charisma: baseAttrs.charisma + totalChaBonus,
      }

      let tempAttrs = await models.AttributeTemp.findOne({
        where: {
          character_id: characterId,
        },
      })

      if (tempAttrs) {
        await tempAttrs.update(newValues)
      } else {
        tempAttrs = await models.AttributeTemp.create({
          character_id: characterId,
          ...newValues,
        })
        console.log('Atributos temporários criados:', newValues)
      }

      return reply.status(201).send(characterEquipment)
    } catch (error) {
      console.error('Error creating character equipment:', error)
      return reply.status(500).send({ error: 'Internal server error' })
    }
  }

  async destroy(request: FastifyRequest<DestroyRequest>, reply: FastifyReply) {
    try {
      const characterEquipmentId = Number(request.params.id)
      const characterId = Number(request.query.char)

      const characterEquipment = await models.CharacterEquipment.findByPk(
        characterEquipmentId
      )

      if (!characterEquipment) {
        return reply
          .status(404)
          .send({ error: 'Character equipment not found' })
      }

      if (characterEquipment.character_id !== characterId) {
        return reply
          .status(403)
          .send({ error: 'This equipment does not belong to this character' })
      }

      // Remove o vínculo do equipamento PRIMEIRO
      await characterEquipment.destroy()

      const baseAttrs = await models.Attribute.findOne({
        where: {
          character_id: characterId,
        },
      })

      if (!baseAttrs) {
        return reply
          .status(404)
          .send({ error: 'Character attributes not found' })
      }

      const remainingCharacterEquipments =
        await models.CharacterEquipment.findAll({
          where: {
            character_id: characterId,
          },
        })

      let totalStrBonus = 0
      let totalDexBonus = 0
      let totalConBonus = 0
      let totalIntBonus = 0
      let totalWisBonus = 0
      let totalChaBonus = 0

      for (const charEquip of remainingCharacterEquipments) {
        const equip = await models.Equipment.findByPk(charEquip.equipment_id)
        if (equip) {
          totalStrBonus += equip.str_temp || 0
          totalDexBonus += equip.dex_temp || 0
          totalConBonus += equip.con_temp || 0
          totalIntBonus += equip.int_temp || 0
          totalWisBonus += equip.wis_temp || 0
          totalChaBonus += equip.cha_temp || 0
        }
      }

      // Buscar os atributos temporários do personagem
      const tempAttrs = await models.AttributeTemp.findOne({
        where: {
          character_id: characterId,
        },
      })

      const newValues = {
        strength: baseAttrs.strength + totalStrBonus,
        dexterity: baseAttrs.dexterity + totalDexBonus,
        constitution: baseAttrs.constitution + totalConBonus,
        intelligence: baseAttrs.intelligence + totalIntBonus,
        wisdom: baseAttrs.wisdom + totalWisBonus,
        charisma: baseAttrs.charisma + totalChaBonus,
      }

      if (tempAttrs) {
        await tempAttrs.update(newValues)
      } else if (remainingCharacterEquipments.length > 0) {
        await models.AttributeTemp.create({
          character_id: characterId,
          ...newValues,
        })
      } else if (remainingCharacterEquipments.length === 0) {
        if (tempAttrs) {
          await tempAttrs.destroy()
        }
      }

      return reply.status(204).send()
    } catch (error) {
      console.error('Error removing character equipment:', error)
      return reply.status(500).send({ error: 'Internal server error' })
    }
  }
}

export default new CharacterEquipmentController()
