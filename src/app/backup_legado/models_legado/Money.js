import { Sequelize, Model } from 'sequelize'

class Money extends Model {
  static init(sequelize) {
    super.init(
      {
        platinum: Sequelize.INTEGER,
        gold: Sequelize.INTEGER,
        silver: Sequelize.INTEGER,
        copper: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.Character, {
      foreignKey: 'character_id',
      as: 'character',
    })
  }
}

export default Money
