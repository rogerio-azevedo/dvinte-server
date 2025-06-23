import { Sequelize, Model } from 'sequelize'

class Campaign extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.STRING,
      },
      {
        sequelize,
      }
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'users',
    })

    this.hasOne(models.GameMap, {
      foreignKey: 'campaign_id',
      as: 'campaign',
    })
  }
}

export default Campaign
