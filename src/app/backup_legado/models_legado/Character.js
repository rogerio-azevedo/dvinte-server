import { Sequelize, Model } from 'sequelize'
import CharacterClass from './CharacterClass'
import CharacterWeapon from './CharacterWeapon'
import CharacterArmor from './CharacterArmor'
import CharacterEquipment from './CharacterEquipment'

class Character extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        age: Sequelize.INTEGER,
        gender: Sequelize.INTEGER,
        skin: Sequelize.STRING,
        eye: Sequelize.STRING,
        hair: Sequelize.STRING,
        height: Sequelize.STRING,
        weight: Sequelize.STRING,
        level: Sequelize.INTEGER,
        size: Sequelize.INTEGER,
        exp: Sequelize.INTEGER,
        health: Sequelize.INTEGER,
        health_now: Sequelize.INTEGER,
        is_ativo: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    )

    return this
  }

  static associate(models) {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    })

    this.belongsTo(models.Portrait, {
      foreignKey: 'portrait_id',
      as: 'portrait',
    })

    this.hasOne(models.CharacterToken, {
      foreignKey: 'character_id',
      as: 'chartoken',
    })

    this.belongsTo(models.Alignment, {
      foreignKey: 'alignment_id',
      as: 'alignment',
    })

    this.belongsTo(models.Race, {
      foreignKey: 'race_id',
      as: 'race',
    })

    this.belongsTo(models.Divinity, {
      foreignKey: 'divinity_id',
      as: 'divinity',
    })

    this.hasOne(models.Attribute, {
      foreignKey: 'character_id',
      as: 'attribute',
    })

    this.hasOne(models.AttributeTemp, {
      foreignKey: 'character_id',
      as: 'attribute_temp',
    })

    this.belongsToMany(models.Class, {
      through: CharacterClass,
      foreignKey: 'character_id',
      as: 'classes',
    })

    this.belongsToMany(models.Armor, {
      through: CharacterArmor,
      foreignKey: 'character_id',
      as: 'armors',
    })

    this.belongsToMany(models.Weapon, {
      through: CharacterWeapon,
      foreignKey: 'character_id',
      as: 'weapons',
    })

    this.belongsToMany(models.Equipment, {
      through: CharacterEquipment,
      foreignKey: 'character_id',
      as: 'equipments',
    })
  }
}

export default Character
