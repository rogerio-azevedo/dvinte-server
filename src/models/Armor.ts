import { Model, Sequelize, DataTypes } from 'sequelize'
import { ArmorAttributes } from './interfaces'

class Armor extends Model<ArmorAttributes> implements ArmorAttributes {
  declare id: number
  declare name: string
  declare type: number
  declare bonus: number
  declare dexterity: number
  declare penalty: number
  declare magic: number
  declare displacement_s: number
  declare displacement_m: number
  declare weight: number
  declare price: number
  declare book: string
  declare version: string
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

export function initArmor(sequelize: Sequelize) {
  Armor.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bonus: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dexterity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      penalty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      magic: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      displacement_s: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      displacement_m: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      book: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      version: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Armor',
      tableName: 'armors',
      underscored: true,
    }
  )

  return Armor
}
