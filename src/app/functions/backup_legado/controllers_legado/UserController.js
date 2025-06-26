import User from '../models/User'

class UserController {
  async index(req, res) {
    const list = await User.findAll({
      attributes: ['id', 'name', 'email'],
      order: ['id'],
    })

    return res.json(list)
  }

  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } })

    if (userExists) {
      return res.status(401).json({ error: 'User alredy exists!' })
    }

    const user = await User.create(req.body)

    const { id, name, email, phone, city, state } = user

    return res.json({
      id,
      name,
      email,
      phone,
      city,
      state,
    })
  }

  async update(req, res) {
    const { email, oldPassword } = req.body

    const user = await User.findByPk(req.userId)

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } })

      if (userExists) {
        return res.status(400).json({
          error: 'Já existe outro usuário com esse e-mail!',
        })
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'A senha não confere!' })
    }

    await user.update(req.body)

    const { id, name } = await User.findByPk(req.userId)

    return res.json({
      id,
      name,
      email,
      // phone,
      // city,
      // state,
    })
  }
}
export default new UserController()
