import Race from '../models/Race'

class RaceController {
  async index(req, res) {
    const list = await Race.findAll({
      order: [['name', 'ASC']],
    })

    return res.json(list)
  }

  async show(req, res) {
    const race = await Race.findByPk(req.params.id)
    return res.json(race)
  }

  async store(req, res) {
    const race = await Race.create(req.body)

    return res.json(race)
  }
}

export default new RaceController()
