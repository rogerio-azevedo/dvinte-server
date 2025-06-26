import { Model, Sequelize, DataTypes } from 'sequelize'
import { RaceAttributes } from './interfaces'

class Race extends Model<RaceAttributes> implements RaceAttributes {
  declare id: number
  declare name: string
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

export function initRace(sequelize: Sequelize) {
  Race.init(
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
      modelName: 'Race',
      tableName: 'races',
      underscored: true,
    }
  )

  return Race
}
