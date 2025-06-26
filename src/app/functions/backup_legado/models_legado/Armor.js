import { Sequelize, Model } from 'sequelize'
import CharacterArmor from './CharacterArmor'

class Armor extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        type: Sequelize.INTEGER,
        bonus: Sequelize.INTEGER,
        dexterity: Sequelize.INTEGER,
        penalty: Sequelize.INTEGER,
        magic: Sequelize.INTEGER,
        displacement_s: Sequelize.FLOAT,
        displacement_m: Sequelize.FLOAT,
        weight: Sequelize.FLOAT,
        price: Sequelize.INTEGER,
        book: Sequelize.STRING,
        version: Sequelize.STRING,
      },
      {
        sequelize,
      }
    )

    return this
  }

  static associate(models) {
    this.belongsToMany(models.Character, {
      foreignKey: 'armor_id',
      through: CharacterArmor,
      as: 'char_armor',
    })
  }
}

export default Armor
