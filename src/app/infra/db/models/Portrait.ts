import { Model, Sequelize, DataTypes } from 'sequelize'
import { PortraitAttributes } from './interfaces'

class Portrait extends Model<PortraitAttributes> implements PortraitAttributes {
  declare id: number
  declare name: string
  declare path: string
  declare url: string
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

export function initPortrait(sequelize: Sequelize) {
  Portrait.init(
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
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.VIRTUAL,
        get() {
          const path = this.getDataValue('path')

          // Retorna a URL completa se for uma URL (R2), senão retorna path para compatibilidade
          return path && path.startsWith('http') ? path : path
        },
      },
    },
    {
      sequelize,
      modelName: 'Portrait',
      tableName: 'portraits',
      underscored: true,
    }
  )

  return Portrait
}
