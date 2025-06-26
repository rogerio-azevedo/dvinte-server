import { Model, ModelStatic } from 'sequelize'
import {
  UserAttributes,
  CharacterAttributes,
  RaceAttributes,
  ClassAttributes,
  AlignmentAttributes,
  DivinityAttributes,
  WeaponAttributes,
  ArmorAttributes,
  EquipmentAttributes,
  PortraitAttributes,
  TokenAttributes,
  CharacterTokenAttributes,
  CharacterWeaponAttributes,
} from './interfaces'

// Interface para o objeto de modelos
export interface Models {
  User: ModelStatic<any>
  Character: ModelStatic<any>
  Race: ModelStatic<any>
  Class: ModelStatic<any>
  Alignment: ModelStatic<any>
  Divinity: ModelStatic<any>
  Weapon: ModelStatic<any>
  Armor: ModelStatic<any>
  Equipment: ModelStatic<any>
  Portrait: ModelStatic<any>
  Token: ModelStatic<any>
  CharacterToken: ModelStatic<any>
  CharacterWeapon: ModelStatic<any>
  CharacterClass: ModelStatic<any>
  CharacterArmor: ModelStatic<any>
  CharacterEquipment: ModelStatic<any>
  GameMap: ModelStatic<any>
  Attribute: ModelStatic<any>
  AttributeTemp: ModelStatic<any>
  BaseAttack: ModelStatic<any>
  BaseResist: ModelStatic<any>
}

// Função para configurar as associações
export function setupAssociations(models: Models) {
  // Character associations
  models.Character.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
  models.Character.belongsTo(models.Race, { foreignKey: 'race_id', as: 'race' })
  models.Character.belongsTo(models.Alignment, {
    foreignKey: 'alignment_id',
    as: 'alignment',
  })
  models.Character.belongsTo(models.Divinity, {
    foreignKey: 'divinity_id',
    as: 'divinity',
  })
  models.Character.belongsTo(models.Portrait, {
    foreignKey: 'portrait_id',
    as: 'portrait',
  })

  // User associations
  models.User.hasMany(models.Character, {
    foreignKey: 'user_id',
    as: 'characters',
  })

  // Race associations
  models.Race.hasMany(models.Character, {
    foreignKey: 'race_id',
    as: 'characters',
  })

  // Alignment associations
  models.Alignment.hasMany(models.Character, {
    foreignKey: 'alignment_id',
    as: 'characters',
  })

  // Divinity associations
  models.Divinity.hasMany(models.Character, {
    foreignKey: 'divinity_id',
    as: 'characters',
  })

  // Portrait associations
  models.Portrait.hasMany(models.Character, {
    foreignKey: 'portrait_id',
    as: 'characters',
  })

  // Token and CharacterToken associations
  models.CharacterToken.belongsTo(models.Token, {
    foreignKey: 'token_id',
    as: 'tokens',
  })
  models.CharacterToken.belongsTo(models.Character, {
    foreignKey: 'character_id',
    as: 'character',
  })
  models.Token.hasMany(models.CharacterToken, {
    foreignKey: 'token_id',
    as: 'characterTokens',
  })
  models.Character.hasOne(models.CharacterToken, {
    foreignKey: 'character_id',
    as: 'characterToken',
  })
}
