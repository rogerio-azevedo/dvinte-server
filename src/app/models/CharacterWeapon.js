import { Sequelize, Model } from 'sequelize'

class CharacterWeapon extends Model {
  static init(sequelize) {
    super.init(
      {
        character_id: Sequelize.INTEGER,
        weapon_id: Sequelize.INTEGER,
        hit: Sequelize.INTEGER,
        damage: Sequelize.INTEGER,
        element: Sequelize.INTEGER,
        crit_mod: Sequelize.INTEGER,
        crit_from_mod: Sequelize.INTEGER,
        dex_damage: Sequelize.BOOLEAN,
        price: Sequelize.INTEGER,
        nickname: Sequelize.STRING,
        description: Sequelize.STRING,
      },
      {
        sequelize,
      }
    )

    return this
  }
}

export default CharacterWeapon
