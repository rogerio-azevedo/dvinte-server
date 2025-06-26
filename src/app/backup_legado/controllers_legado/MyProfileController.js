import Character from '../models/Character'
import User from '../models/User'

class MyProfileController {
  async index(req, res) {
    const char = await Character.findOne({
      attributes: ['id'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: [],
          where: { id: req.query.user },
        },
      ],
    })

    return res.json(char.id)
  }
}

export default new MyProfileController()
