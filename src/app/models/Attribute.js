import { Sequelize, Model } from 'sequelize'

class Attribute extends Model {
  static init(sequelize) {
    super.init(
      {
        strength: Sequelize.INTEGER,
        dexterity: Sequelize.INTEGER,
        constitution: Sequelize.INTEGER,
        intelligence: Sequelize.INTEGER,
        wisdom: Sequelize.INTEGER,
        charisma: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    )

    return this
  }
}

export default Attribute
