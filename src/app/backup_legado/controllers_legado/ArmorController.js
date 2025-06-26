import Armor from '../models/Armor'

class ArmorController {
  async index(req, res) {
    const list = await Armor.findAll({
      order: [['name', 'ASC']],
    })

    return res.json(list)
  }

  async store(req, res) {
    const arm = {
      name: req.body.name.toUpperCase(),
      bonus: Number(req.body.bonus),
      dexterity: Number(req.body.dexterity),
      penalty: Number(req.body.penalty),
      magic: Number(req.body.magic),
      price: Number(req.body.price),
      displacement_s: parseFloat(req.body.displacement_s),
      displacement_m: parseFloat(req.body.displacement_m),
      type: Number(req.body.type),
      weight: parseFloat(req.body.weight),
      book: req.body.book,
      version: req.body.version,
    }

    const armor = await Armor.create(arm)

    return res.json(armor)
  }
}

export default new ArmorController()
