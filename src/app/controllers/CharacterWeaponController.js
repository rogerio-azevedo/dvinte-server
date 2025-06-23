import CharacterWeapon from '../models/CharacterWeapon'

class CharacterWeaponController {
  async store(req, res) {
    const weaponChar = {
      character_id: req.body?.character,
      weapon_id: Number(req.body?.weapon),
      hit: Number(req.body?.hit),
      damage: Number(req.body?.damage),
      element: Number(req.body?.element),
      crit_mod: Number(req.body?.crit_mod),
      crit_from_mod: Number(req.body?.crit_from_mod),
      dex_damage: req.body?.dex_damage ? req.body.dex_damage : false,
      price: Number(req.body?.price),
      nickname: req.body?.nickname,
      description: req.body?.description,
    }
    const weapon = await CharacterWeapon.create(weaponChar)

    return res.json(weapon)
  }

  async destroy(req, res) {
    const charId = Number(req.query.char)
    const weaponId = Number(req.params.id)

    await CharacterWeapon.destroy({
      where: {
        character_id: charId,
        weapon_id: weaponId,
      },
    })

    return res.status(201).send()
  }
}

export default new CharacterWeaponController()
