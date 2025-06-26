import { Sequelize, Model } from 'sequelize'

class BaseResist extends Model {
  static init(sequelize) {
    super.init(
      {
        level: Sequelize.INTEGER,
        low: Sequelize.INTEGER,
        high: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    )

    return this
  }
}

export default BaseResist
