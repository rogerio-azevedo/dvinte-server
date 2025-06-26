import { Sequelize, Model, DataTypes, ModelStatic } from 'sequelize'

interface GameMapAttributes {
  id: number
  campaign_id: number | null
  battle: string
  world: string | null
  width: number | null
  height: number | null
  grid: boolean | null
  fog: boolean | null
  gm_layer: boolean | null
  owner: number | null
  created_at: Date
  updated_at: Date
}

class GameMap extends Model<GameMapAttributes> {
  declare id: number
  declare campaign_id: number | null
  declare battle: string
  declare world: string | null
  declare width: number | null
  declare height: number | null
  declare grid: boolean | null
  declare fog: boolean | null
  declare gm_layer: boolean | null
  declare owner: number | null
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
      campaign_id: DataTypes.INTEGER,
      battle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      world: DataTypes.STRING,
      width: DataTypes.INTEGER,
      height: DataTypes.INTEGER,
      grid: DataTypes.BOOLEAN,
      fog: DataTypes.BOOLEAN,
      gm_layer: DataTypes.BOOLEAN,
      owner: DataTypes.INTEGER,
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
