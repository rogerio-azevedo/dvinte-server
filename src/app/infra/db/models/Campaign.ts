import { Sequelize, Model, DataTypes, ModelStatic } from 'sequelize'

interface CampaignAttributes {
  id: number
  name: string
  description: string
  user_id: number
  created_at: Date
  updated_at: Date
}

class Campaign extends Model<CampaignAttributes> {
  declare id: number
  declare name: string
  declare description: string
  declare user_id: number
  declare readonly created_at: Date
  declare readonly updated_at: Date

  // Associations
  declare user?: any
  declare gameMap?: any
}

export const initCampaign = (sequelize: Sequelize): ModelStatic<Campaign> => {
  Campaign.init(
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
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
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
      tableName: 'campaigns',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )

  return Campaign
}

export { Campaign }
