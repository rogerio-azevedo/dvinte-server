import { Sequelize, Model } from 'sequelize'
import CharacterEquipment from './CharacterEquipment'

class Equipment extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        str_temp: Sequelize.INTEGER,
        dex_temp: Sequelize.INTEGER,
        con_temp: Sequelize.INTEGER,
        int_temp: Sequelize.INTEGER,
        wis_temp: Sequelize.INTEGER,
        cha_temp: Sequelize.INTEGER,
        price: Sequelize.INTEGER,
        weight: Sequelize.FLOAT,
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
      foreignKey: 'equipment_id',
      through: CharacterEquipment,
      as: 'char_equipment',
    })
  }
}

export default Equipment
