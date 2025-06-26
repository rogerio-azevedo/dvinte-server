import BaseAttack from '../models/BaseAttack'

class BaseAtackController {
  async index(req, res) {
    const classes = await BaseAttack.findAll({
      // order: [
      //   ['class_id', 'ASC'],
      //   ['level', 'ASC'],
      // ],
    })

    return res.json(classes)
  }

  async store(req, res) {
    const data = req.body

    const result = BaseAttack.bulkCreate(data, { returning: true })

    return res.json(result)
  }
}

export default new BaseAtackController()
