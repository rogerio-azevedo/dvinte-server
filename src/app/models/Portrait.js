import { Sequelize, Model } from 'sequelize'

class Portrait extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/portrait-files/${this.path}`
          },
        },
      },
      {
        sequelize,
      }
    )

    return this
  }
}

export default Portrait
