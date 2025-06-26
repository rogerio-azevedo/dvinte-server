import { Sequelize, Model } from 'sequelize'

class CharacterEquipment extends Model {
  static init(sequelize) {
    super.init(
      {
        character_id: Sequelize.INTEGER,
        equipment_id: Sequelize.INTEGER,
        description: Sequelize.STRING,
      },
      {
        sequelize,
      }
    )

    return this
  }
}

export default CharacterEquipment
