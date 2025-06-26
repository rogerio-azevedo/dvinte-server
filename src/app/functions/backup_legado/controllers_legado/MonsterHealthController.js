import Monster from '../models/Monster'

class HealthController {
  async update(req, res) {
    const monster = await Monster.findByPk(req.query.id)
    const new_Health = Number(req.body.newHealth)

    console.log(new_Health)
    console.log(monster)
    function setHealth() {
      let new_health = 0

      if (monster?.health_now + new_Health >= monster.health) {
        new_health = monster.health
      } else {
        new_health = monster.health_now + new_Health
      }
      return new_health
    }

    const newChar = await monster.update({
      health_now: setHealth(),
    })

    return res.json(newChar)
  }
}

export default new HealthController()
