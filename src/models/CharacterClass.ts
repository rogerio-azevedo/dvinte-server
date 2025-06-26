import { Sequelize, Model, DataTypes, ModelStatic } from 'sequelize'

interface CharacterClassAttributes {
  id: number
  character_id: number
  class_id: number
  level: number
  created_at: Date
  updated_at: Date
}

class CharacterClass extends Model<CharacterClassAttributes> {
  declare id: number
  declare character_id: number
  declare class_id: number
  declare level: number
  declare readonly created_at: Date
  declare readonly updated_at: Date

  static associate(models: any): void {
    this.belongsTo(models.Character, {
      foreignKey: 'character_id',
      as: 'character',
    })

    this.belongsTo(models.Class, {
      foreignKey: 'class_id',
      as: 'class',
    })
  }
}

const initCharacterClass = (
  sequelize: Sequelize
): ModelStatic<CharacterClass> => {
  CharacterClass.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      character_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'CharacterClass',
      tableName: 'character_classes',
      underscored: true,
    }
  )

  return CharacterClass
}

export { CharacterClass as default, initCharacterClass }
