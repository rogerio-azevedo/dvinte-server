import { Sequelize, Model } from 'sequelize'

class MonsterAttack extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        dice: Sequelize.INTEGER,
        multiplier: Sequelize.INTEGER,
        critical: Sequelize.INTEGER,
        crit_from: Sequelize.INTEGER,
        range: Sequelize.FLOAT,
        hit: Sequelize.INTEGER,
        damage: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    )

    return this
  }
}

export default MonsterAttack
