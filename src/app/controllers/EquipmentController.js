import Equipment from '../models/Equipment'

class EquipmentController {
  async index(req, res) {
    const list = await Equipment.findAll({
      order: [['name', 'ASC']],
    })

    return res.json(list)
  }

  async store(req, res) {
    const equip = {
      name: req.body.name.toUpperCase(),
      str_temp: Number(req.body.str_temp),
      dex_temp: Number(req.body.dex_temp),
      con_temp: Number(req.body.con_temp),
      int_temp: Number(req.body.int_temp),
      wis_temp: Number(req.body.wis_temp),
      cha_temp: Number(req.body.cha_temp),
      price: Number(req.body.price),
      weight: parseFloat(req.body.weight),
      book: req.body.book,
      version: req.body.version,
    }

    const equipment = await Equipment.create(equip)

    return res.json(equipment)
  }
}

export default new EquipmentController()
