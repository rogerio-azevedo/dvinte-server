import BaseResist from '../models/BaseResist'

class BaseResistController {
  async index(req, res) {
    const classes = await BaseResist.findAll({
      // order: [
      //   ['class_id', 'ASC'],
      //   ['level', 'ASC'],
      // ],
    })

    return res.json(classes)
  }

  async store(req, res) {
    const data = req.body

    const result = BaseResist.bulkCreate(data, { returning: true })

    return res.json(result)
  }
}

export default new BaseResistController()
