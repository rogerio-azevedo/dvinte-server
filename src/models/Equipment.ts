import { Model, Sequelize, DataTypes } from 'sequelize'
import { EquipmentAttributes } from './interfaces'

class Equipment
  extends Model<EquipmentAttributes>
  implements EquipmentAttributes
{
  declare id: number
  declare name: string
  declare description: string
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

export function initEquipment(sequelize: Sequelize) {
  Equipment.init(
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
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Equipment',
      tableName: 'equipments',
      underscored: true,
    }
  )

  return Equipment
}
