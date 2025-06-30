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

      // Buscar o equipamento
      const equipment = await models.Equipment.findOne({
        where: {
          id: equipmentId,
        },
      })

      if (!equipment) {
        return reply.status(404).send({ error: 'Equipment not found' })
      }

      // Criar o vínculo do equipamento com o personagem
      const characterEquipment = await models.CharacterEquipment.create({
        character_id: characterId,
        equipment_id: equipmentId,
        description: description || null,
      })

      // Buscar os atributos temporários do personagem
      let tempAttrs = await models.AttributeTemp.findOne({
        where: {
          character_id: characterId,
        },
      })

      // Se não existirem atributos temporários, buscar os atributos base e criar os temporários
      if (!tempAttrs) {
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

        // Criar atributos temporários baseados nos atributos base
        tempAttrs = await models.AttributeTemp.create({
          character_id: characterId,
          strength: baseAttrs.strength + (equipment.str_temp || 0),
          dexterity: baseAttrs.dexterity + (equipment.dex_temp || 0),
          constitution: baseAttrs.constitution + (equipment.con_temp || 0),
          intelligence: baseAttrs.intelligence + (equipment.int_temp || 0),
          wisdom: baseAttrs.wisdom + (equipment.wis_temp || 0),
          charisma: baseAttrs.charisma + (equipment.cha_temp || 0),
        })

        console.log('Atributos temporários criados:', {
          strength: tempAttrs.strength,
          constitution: tempAttrs.constitution,
        })
      } else {
        // Se já existirem atributos temporários, atualiza eles adicionando os bônus do equipamento
        const newValues = {
          strength: tempAttrs.strength + (equipment.str_temp || 0),
          dexterity: tempAttrs.dexterity + (equipment.dex_temp || 0),
          constitution: tempAttrs.constitution + (equipment.con_temp || 0),
          intelligence: tempAttrs.intelligence + (equipment.int_temp || 0),
          wisdom: tempAttrs.wisdom + (equipment.wis_temp || 0),
          charisma: tempAttrs.charisma + (equipment.cha_temp || 0),
        }

        await tempAttrs.update(newValues)
        await tempAttrs.reload()

        console.log('Atributos temporários atualizados:', {
          strength: tempAttrs.strength,
          constitution: tempAttrs.constitution,
        })
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

      // Buscar o vínculo character_equipment
      const characterEquipment = await models.CharacterEquipment.findByPk(
        characterEquipmentId
      )

      if (!characterEquipment) {
        return reply
          .status(404)
          .send({ error: 'Character equipment not found' })
      }

      // Verificar se o vínculo pertence ao personagem correto
      if (characterEquipment.character_id !== characterId) {
        return reply
          .status(403)
          .send({ error: 'This equipment does not belong to this character' })
      }

      // Buscar o equipamento
      const equipment = await models.Equipment.findByPk(
        characterEquipment.equipment_id
      )

      if (!equipment) {
        return reply.status(404).send({ error: 'Equipment not found' })
      }

      // Buscar os atributos temporários do personagem
      const tempAttrs = await models.AttributeTemp.findOne({
        where: {
          character_id: characterId,
        },
      })

      // Se existirem atributos temporários, atualiza eles removendo os bônus do equipamento
      if (tempAttrs) {
        const newValues = {
          strength: tempAttrs.strength - (equipment.str_temp || 0),
          dexterity: tempAttrs.dexterity - (equipment.dex_temp || 0),
          constitution: tempAttrs.constitution - (equipment.con_temp || 0),
          intelligence: tempAttrs.intelligence - (equipment.int_temp || 0),
          wisdom: tempAttrs.wisdom - (equipment.wis_temp || 0),
          charisma: tempAttrs.charisma - (equipment.cha_temp || 0),
        }

        // Primeiro atualiza os atributos temporários
        await tempAttrs.update(newValues)

        // Depois remove o vínculo do equipamento
        await characterEquipment.destroy()

        // Recarrega os atributos temporários para garantir que foram atualizados
        await tempAttrs.reload()

        console.log('Atributos temporários após remoção:', {
          strength: tempAttrs.strength,
          constitution: tempAttrs.constitution,
        })
      } else {
        // Se não existirem atributos temporários, apenas remove o vínculo
        await characterEquipment.destroy()
      }

      return reply.status(204).send()
    } catch (error) {
      console.error('Error removing character equipment:', error)
      return reply.status(500).send({ error: 'Internal server error' })
    }
  }
}

export default new CharacterEquipmentController()
