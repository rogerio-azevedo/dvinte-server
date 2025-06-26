import { Model, Sequelize, DataTypes } from 'sequelize'
import { WeaponAttributes } from './interfaces'

class Weapon extends Model<WeaponAttributes> implements WeaponAttributes {
  declare id: number
  declare name: string
  declare dice_s: number
  declare dice_m: number
  declare multiplier_s: number
  declare multiplier_m: number
  declare critical: number
  declare crit_from: number
  declare range: number
  declare type: string
  declare material: string
  declare weight: number
  declare price: number
  declare str_bonus: number
  declare book: string
  declare version: string
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

export function initWeapon(sequelize: Sequelize) {
  Weapon.init(
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
      dice_s: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dice_m: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      multiplier_s: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      multiplier_m: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      critical: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      crit_from: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      range: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      material: DataTypes.STRING,
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      price: DataTypes.INTEGER,
      str_bonus: {
        type: DataTypes.FLOAT,
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
      modelName: 'Weapon',
      tableName: 'weapons',
      underscored: true,
    }
  )

  return Weapon
}
