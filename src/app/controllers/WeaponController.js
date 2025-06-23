import Weapon from '../models/Weapon'

class WeaponController {
  async index(req, res) {
    const list = await Weapon.findAll({
      order: [['name', 'ASC']],
    })

    return res.json(list)
  }

  async store(req, res) {
    const wep = {
      name: req.body.name.toUpperCase(),
      crit_from: Number(req.body.crit_from),
      critical: Number(req.body.critical),
      dice_m: Number(req.body.dice_m),
      dice_s: Number(req.body.dice_s),
      material: req.body.material,
      multiplier_m: Number(req.body.multiplier_m),
      multiplier_s: Number(req.body.multiplier_s),
      price: Number(req.body.price),
      range: parseFloat(req.body.range),
      str_bonus: parseFloat(req.body.str_bonus),
      type: req.body.type,
      weight: parseFloat(req.body.weight),
      book: req.body.book,
      version: req.body.version,
    }

    const weapon = await Weapon.create(wep)

    return res.json(weapon)
  }
}

export default new WeaponController()
