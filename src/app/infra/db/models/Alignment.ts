import { Model, Sequelize, DataTypes } from 'sequelize'
import { AlignmentAttributes } from './interfaces'

class Alignment
  extends Model<AlignmentAttributes>
  implements AlignmentAttributes
{
  declare id: number
  declare name: string
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

export function initAlignment(sequelize: Sequelize) {
  Alignment.init(
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
      modelName: 'Alignment',
      tableName: 'alignments',
      underscored: true,
    }
  )

  return Alignment
}
