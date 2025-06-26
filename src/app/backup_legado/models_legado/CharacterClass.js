import { Sequelize, Model } from 'sequelize'

class CharacterClass extends Model {
  static init(sequelize) {
    super.init(
      {
        character_id: Sequelize.INTEGER,
        class_id: Sequelize.INTEGER,
        level: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    )

    return this
  }
}
export default CharacterClass
