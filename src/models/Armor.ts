import { Model, Sequelize, DataTypes } from 'sequelize'
import { ArmorAttributes } from './interfaces'

class Armor extends Model<ArmorAttributes> implements ArmorAttributes {
  declare id: number
  declare name: string
  declare ac: number
  declare type: string
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
      ac: DataTypes.INTEGER,
      type: DataTypes.STRING,
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
