import Alignment from '../models/Alignment'

class AlignmentController {
  async index(req, res) {
    const list = await Alignment.findAll({
      order: [['name', 'ASC']],
    })

    return res.json(list)
  }

  async show(req, res) {
    const alig = await Alignment.findByPk(req.params.id)
    return res.json(alig)
  }

  async store(req, res) {
    const alignments = await Alignment.create(req.body)

    return res.json(alignments)
  }
}

export default new AlignmentController()
