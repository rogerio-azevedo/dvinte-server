import CharacterEquipment from '../models/CharacterEquipment'
import AttributeTemp from '../models/AttributeTemp'
import Attribute from '../models/Attribute'
import Equipment from '../models/Equipment'

class CharacterWeaponController {
  async store(req, res) {
    const charEquip = {
      character_id: Number(req.body?.character),
      equipment_id: Number(req.body?.equipment),
      description: req.body?.description,
    }

    const setEquip = await CharacterEquipment.create(charEquip)

    const tempAttrs = await AttributeTemp.findOne({
      where: {
        character_id: req.body?.character,
      },
    })

    const attrs = await Attribute.findOne({
      where: {
        character_id: req.body?.character,
      },
    })

    const equip = await Equipment.findOne({
      where: {
        id: req.body?.equipment,
      },
    })

    let newAttrs = {}

    if (tempAttrs) {
      newAttrs = {
        character_id: req.body?.character,
        strength: tempAttrs.strength + equip.str_temp,
        dexterity: tempAttrs.dexterity + equip.dex_temp,
        constitution: tempAttrs.constitution + equip.con_temp,
        intelligence: tempAttrs.intelligence + equip.int_temp,
        wisdom: tempAttrs.wisdom + equip.wis_temp,
        charisma: tempAttrs.charisma + equip.cha_temp,
      }

      await AttributeTemp.update(newAttrs, {
        where: { character_id: req.body?.character },
      })
    } else {
      newAttrs = {
        character_id: req.body?.character,
        strength: attrs.strength + equip.str_temp,
        dexterity: attrs.dexterity + equip.dex_temp,
        constitution: attrs.constitution + equip.con_temp,
        intelligence: attrs.intelligence + equip.int_temp,
        wisdom: attrs.wisdom + equip.wis_temp,
        charisma: attrs.charisma + equip.cha_temp,
      }
      await AttributeTemp.create(newAttrs)
    }

    return res.json(setEquip)
  }

  async destroy(req, res) {
    const charId = Number(req.query.char)
    const equipId = Number(req.params.id)

    const charEquip = await CharacterEquipment.findOne({
      where: {
        character_id: charId,
        equipment_id: equipId,
      },
    })

    const equip = await Equipment.findOne({
      where: {
        id: equipId,
      },
    })

    const tempAttrs = await AttributeTemp.findOne({
      where: {
        character_id: charId,
      },
    })

    if (tempAttrs) {
      await CharacterEquipment.destroy({
        where: {
          character_id: charId,
          equipment_id: equipId,
        },
      })

      const newAttrs = {
        character_id: charId,
        strength: tempAttrs.strength - equip.str_temp,
        dexterity: tempAttrs.dexterity - equip.dex_temp,
        constitution: tempAttrs.constitution - equip.con_temp,
        intelligence: tempAttrs.intelligence - equip.int_temp,
        wisdom: tempAttrs.wisdom - equip.wis_temp,
        charisma: tempAttrs.charisma - equip.cha_temp,
      }
      await AttributeTemp.update(newAttrs, {
        where: { character_id: charId },
      })
    } else {
      await CharacterEquipment.destroy({
        where: {
          character_id: charId,
          equipment_id: equipId,
        },
      })
    }

    return res.status(201).send()
  }
}

export default new CharacterWeaponController()
