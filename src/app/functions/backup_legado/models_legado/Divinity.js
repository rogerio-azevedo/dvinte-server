import { Sequelize, Model } from 'sequelize'

class Divinity extends Model {
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

export default Divinity
