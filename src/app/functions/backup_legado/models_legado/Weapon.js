import { Sequelize, Model } from 'sequelize'
import CharacterWeapon from './CharacterWeapon'

class Weapon extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        dice_s: Sequelize.INTEGER,
        dice_m: Sequelize.INTEGER,
        multiplier_s: Sequelize.INTEGER,
        multiplier_m: Sequelize.INTEGER,
        critical: Sequelize.INTEGER,
        crit_from: Sequelize.INTEGER,
        range: Sequelize.FLOAT,
        type: Sequelize.STRING,
        material: Sequelize.STRING,
        weight: Sequelize.FLOAT,
        price: Sequelize.INTEGER,
        str_bonus: Sequelize.FLOAT,
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
      foreignKey: 'weapon_id',
      through: CharacterWeapon,
      as: 'char_weapon',
    })
  }
}

export default Weapon
