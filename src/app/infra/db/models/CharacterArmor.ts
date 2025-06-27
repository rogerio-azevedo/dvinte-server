import { Sequelize, Model, DataTypes, ModelStatic } from 'sequelize'

interface CharacterArmorAttributes {
  id: number
  character_id: number
  armor_id: number
  defense: number
  price: number
  description: string | null
  created_at: Date
  updated_at: Date
}

class CharacterArmor extends Model<CharacterArmorAttributes> {
  declare id: number
  declare character_id: number
  declare armor_id: number
  declare defense: number
  declare price: number
  declare description: string | null
  declare readonly created_at: Date
  declare readonly updated_at: Date

  static associate(models: any): void {
    this.belongsTo(models.Character, {
      foreignKey: 'character_id',
      as: 'character',
    })

    this.belongsTo(models.Armor, {
      foreignKey: 'armor_id',
      as: 'armor',
    })
  }
}

const initCharacterArmor = (
  sequelize: Sequelize
): ModelStatic<CharacterArmor> => {
  CharacterArmor.init(
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
      armor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      defense: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      description: DataTypes.TEXT,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'CharacterArmor',
      tableName: 'character_armors',
      underscored: true,
    }
  )

  return CharacterArmor
}

export { CharacterArmor as default, initCharacterArmor }
