import { Sequelize, Model, DataTypes, ModelStatic } from 'sequelize'

interface BaseAttackAttributes {
  id: number
  level: number
  low: number
  medium: number
  high: number
  created_at: Date
  updated_at: Date
}

class BaseAttack extends Model<BaseAttackAttributes> {
  declare id: number
  declare level: number
  declare low: number
  declare medium: number
  declare high: number
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

export const initBaseAttack = (
  sequelize: Sequelize
): ModelStatic<BaseAttack> => {
  BaseAttack.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      low: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      medium: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      high: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'base_attacks',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )

  return BaseAttack
}
