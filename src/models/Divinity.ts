import { Model, Sequelize, DataTypes } from 'sequelize'
import { DivinityAttributes } from './interfaces'

class Divinity extends Model<DivinityAttributes> implements DivinityAttributes {
  declare id: number
  declare name: string
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

export function initDivinity(sequelize: Sequelize) {
  Divinity.init(
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
    },
    {
      sequelize,
      modelName: 'Divinity',
      tableName: 'divinities',
      underscored: true,
    }
  )

  return Divinity
}
