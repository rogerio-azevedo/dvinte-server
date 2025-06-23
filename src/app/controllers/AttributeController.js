import Attribute from '../models/Attribute'

class AttributeController {
  async index(req, res) {
    const atts = await Attribute.findAll({})

    return res.json(atts)
  }

  async store(req, res) {
    const atts = await Attribute.create(req.body)

    return res.json(atts)
  }
}

export default new AttributeController()
