import { Sequelize, Model } from 'sequelize'

class CharacterArmor extends Model {
  static init(sequelize) {
    super.init(
      {
        character_id: Sequelize.INTEGER,
        armor_id: Sequelize.INTEGER,
        defense: Sequelize.INTEGER,
        price: Sequelize.INTEGER,
        description: Sequelize.STRING,
      },
      {
        sequelize,
      }
    )

    return this
  }
}
export default CharacterArmor
