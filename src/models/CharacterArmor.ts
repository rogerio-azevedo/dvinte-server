import { Sequelize, Model, DataTypes, ModelStatic } from 'sequelize'

interface CharacterArmorAttributes {
  id: number
  character_id: number
  armor_id: number
  ac_bonus: number
  max_dex: number
  check_penalty: number
  spell_failure: number
  speed: number
  price: number
  nickname: string | null
  description: string | null
  created_at: Date
  updated_at: Date
}

class CharacterArmor extends Model<CharacterArmorAttributes> {
  declare id: number
  declare character_id: number
  declare armor_id: number
  declare ac_bonus: number
  declare max_dex: number
  declare check_penalty: number
  declare spell_failure: number
  declare speed: number
  declare price: number
  declare nickname: string | null
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
      ac_bonus: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      max_dex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      check_penalty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      spell_failure: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      speed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      nickname: DataTypes.STRING,
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
