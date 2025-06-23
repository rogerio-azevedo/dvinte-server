import { Sequelize, Model } from 'sequelize'

class Alignment extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      {
        sequelize,
      }
    )

    return this
  }
}

export default Alignment
