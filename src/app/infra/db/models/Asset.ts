import { Model, Sequelize, DataTypes } from 'sequelize'

export interface AssetAttributes {
  id: number
  url: string
  original_name: string
  uploaded_at: Date
}

class Asset extends Model<AssetAttributes> implements AssetAttributes {
  declare id: number
  declare url: string
  declare original_name: string
  declare uploaded_at: Date
}

export function initAsset(sequelize: Sequelize) {
  Asset.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      original_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uploaded_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Asset',
      tableName: 'assets',
      underscored: true,
      timestamps: false,
    }
  )
  return Asset
}
