import Initiative from '../schemas/Initiative'

import { addInitiative } from '../../websocket'

class InitiativeController {
  async index(req, res) {
    const inits = await Initiative.find()

    return res.json(inits)
  }

  async store(req, res) {
    const inits = await Initiative.create(req.body)

    const message = {
      user: inits.user,
      initiative: inits.initiative,
    }
    addInitiative(message)

    return res.json(inits)
  }

  async destroy(req, res) {
    const inits = await Initiative.deleteMany({})

    return res.json(inits)
  }
}

export default new InitiativeController()
