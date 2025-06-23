import { Sequelize, Model } from 'sequelize'

class BaseAttack extends Model {
  static init(sequelize) {
    super.init(
      {
        level: Sequelize.INTEGER,
        low: Sequelize.INTEGER,
        medium: Sequelize.INTEGER,
        high: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    )

    return this
  }
}

export default BaseAttack
