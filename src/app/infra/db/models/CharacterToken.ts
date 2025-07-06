import { Model, Sequelize, DataTypes } from 'sequelize'
import { CharacterTokenAttributes } from './interfaces'

class CharacterToken
  extends Model<CharacterTokenAttributes>
  implements CharacterTokenAttributes
{
  declare id: number
  declare character_id: number
  declare token_id: number
  declare x: number
  declare y: number
  declare width: number
  declare height: number
  declare rotation: number
  declare enabled: boolean
  declare readonly created_at: Date
  declare readonly updated_at: Date

  static associate(models: any): void {
    this.belongsTo(models.Token, {
      foreignKey: 'token_id',
      as: 'tokens',
    })
    this.belongsTo(models.Character, {
      foreignKey: 'character_id',
      as: 'character',
    })
  }
}

export function initCharacterToken(sequelize: Sequelize) {
  CharacterToken.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      character_id: DataTypes.INTEGER,
      token_id: DataTypes.INTEGER,
      x: DataTypes.FLOAT,
      y: DataTypes.FLOAT,
      width: DataTypes.FLOAT,
      height: DataTypes.FLOAT,
      rotation: DataTypes.FLOAT,
      enabled: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'CharacterToken',
      tableName: 'character_tokens',
      underscored: true,
    }
  )

  return CharacterToken
}
