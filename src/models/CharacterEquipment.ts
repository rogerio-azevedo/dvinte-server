import { Sequelize, Model, DataTypes, ModelStatic } from 'sequelize'

interface CharacterEquipmentAttributes {
  id: number
  character_id: number
  equipment_id: number
  quantity: number
  price: number
  nickname: string | null
  description: string | null
  created_at: Date
  updated_at: Date
}

class CharacterEquipment extends Model<CharacterEquipmentAttributes> {
  declare id: number
  declare character_id: number
  declare equipment_id: number
  declare quantity: number
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

    this.belongsTo(models.Equipment, {
      foreignKey: 'equipment_id',
      as: 'equipment',
    })
  }
}

const initCharacterEquipment = (
  sequelize: Sequelize
): ModelStatic<CharacterEquipment> => {
  CharacterEquipment.init(
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
      equipment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
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
      modelName: 'CharacterEquipment',
      tableName: 'character_equipments',
      underscored: true,
    }
  )

  return CharacterEquipment
}

export { CharacterEquipment as default, initCharacterEquipment }
