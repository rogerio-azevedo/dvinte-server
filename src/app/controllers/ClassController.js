import Class from '../models/Class'

class ClassController {
  async index(req, res) {
    const classes = await Class.findAll({
      order: [['name', 'ASC']],
    })

    return res.json(classes)
  }

  async show(req, res) {
    const classe = await Class.findByPk(req.params.id)
    return res.json(classe)
  }

  async store(req, res) {
    const classes = await Class.create(req.body)

    return res.json(classes)
  }
}

export default new ClassController()
