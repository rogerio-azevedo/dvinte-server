import AttributeTemp from '../models/AttributeTemp'

class AttributeTempController {
  async index(req, res) {
    const atts = await AttributeTemp.findAll({})

    return res.json(atts)
  }

  async show(req, res) {
    const attrs = await AttributeTemp.findOne({
      where: {
        character_id: req.params.id,
      },
    })
    return res.json(attrs)
  }

  async store(req, res) {
    const atts = await AttributeTemp.create(req.body)

    return res.json(atts)
  }

  async update(req, res) {
    const attrs = await AttributeTemp.findOne({
      where: {
        character_id: req.params.id,
      },
    })

    let newAttrs = {}

    if (attrs) {
      newAttrs = {
        character_id: attrs.character_id,
        strength: attrs.strength + req.body.str,
        dexterity: attrs.dexterity,
        constitution: attrs.constitution + req.body.con,
        intelligence: attrs.intelligence,
        wisdom: attrs.wisdom,
        charisma: attrs.charisma,
      }
    }

    await AttributeTemp.update(newAttrs, {
      where: { character_id: attrs.character_id },
    })
    return res.json(attrs)
  }
}

export default new AttributeTempController()
