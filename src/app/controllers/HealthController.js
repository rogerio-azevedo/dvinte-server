import Character from '../models/Character'

class HealthController {
  async update(req, res) {
    const char = await Character.findByPk(req.query.id)

    const new_Health = Number(req.body.newHealth)

    function setHealth() {
      let new_health = 0

      if (char && char.health_now + new_Health >= char.health) {
        new_health = char.health
      } else {
        new_health = char.health_now + new_Health
      }
      return new_health
    }

    const newChar = await char.update({
      health_now: setHealth(),
    })

    return res.json(newChar)
  }
}

export default new HealthController()
