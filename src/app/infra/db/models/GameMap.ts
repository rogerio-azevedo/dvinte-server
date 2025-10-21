import { Sequelize, Model, DataTypes, ModelStatic } from 'sequelize'

interface GameMapAttributes {
  id: number
  campaign_id: number
  battle: string
  world: string
  battle_gm?: string
  portrait?: string
  portrait_gm?: string
  orientation?: boolean
  width: number
  height: number
  grid: boolean
  fog: boolean
  gm_layer: boolean
  owner: number
  created_at: Date
  updated_at: Date
}

class GameMap extends Model<GameMapAttributes> {
  declare id: number
  declare campaign_id: number
  declare battle: string
  declare world: string
  declare battle_gm?: string
  declare portrait?: string
  declare portrait_gm?: string
  declare orientation?: boolean
  declare width: number
  declare height: number
  declare grid: boolean
  declare fog: boolean
  declare gm_layer: boolean
  declare owner: number
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

const initGameMap = (sequelize: Sequelize): ModelStatic<GameMap> => {
  GameMap.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      campaign_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      battle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      world: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      battle_gm: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      portrait: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      portrait_gm: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      orientation: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      width: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      grid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      fog: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      gm_layer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      owner: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'GameMap',
      tableName: 'game_maps',
      underscored: true,
    }
  )

  return GameMap
}

export { GameMap as default, initGameMap }
