import { Sequelize, Model } from 'sequelize'
import bcrypt from 'bcryptjs'

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        phone: Sequelize.STRING,
        city: Sequelize.STRING,
        state: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        is_ativo: Sequelize.BOOLEAN,
        is_gm: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    )
    this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8)
      }
    })

    return this
  }

  static associate(models) {
    this.hasMany(models.Character, {
      foreignKey: 'user_id',
      as: 'character',
    })
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash)
  }
}

export default User
