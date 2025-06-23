import CharacterArmor from '../models/CharacterArmor'

class CharacterArmorController {
  async store(req, res) {
    const armorChar = {
      character_id: req.body?.character,
      armor_id: Number(req.body?.armor),
      defense: Number(req.body?.defense),
      price: Number(req.body?.price),
      description: req.body?.description,
    }
    const armor = await CharacterArmor.create(armorChar)

    return res.json(armor)
  }

  async destroy(req, res) {
    const charId = Number(req.query.char)
    const armorId = Number(req.params.id)

    await CharacterArmor.destroy({
      where: {
        character_id: charId,
        armor_id: armorId,
      },
    })

    return res.status(201).send()
  }
}

export default new CharacterArmorController()
