import { Sequelize, Model, DataTypes, ModelStatic } from 'sequelize'

interface BaseResistAttributes {
  id: number
  level: number
  low: number
  high: number
  created_at: Date
  updated_at: Date
}

class BaseResist extends Model<BaseResistAttributes> {
  declare id: number
  declare level: number
  declare low: number
  declare high: number
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

export const initBaseResist = (
  sequelize: Sequelize
): ModelStatic<BaseResist> => {
  BaseResist.init(
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
      tableName: 'base_resists',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )

  return BaseResist
}
