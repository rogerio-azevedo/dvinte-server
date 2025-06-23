import { Sequelize, Model } from 'sequelize'

class GameMap extends Model {
  static init(sequelize) {
    super.init(
      {
        battle: Sequelize.STRING,
        world: Sequelize.STRING,
        width: Sequelize.INTEGER,
        height: Sequelize.INTEGER,
        grid: Sequelize.BOOLEAN,
        fog: Sequelize.BOOLEAN,
        gm_layer: Sequelize.BOOLEAN,
        owner: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    )

    return this
  }
}

export default GameMap
