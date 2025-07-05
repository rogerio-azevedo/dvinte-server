import { Sequelize, Model, DataTypes, ModelStatic } from 'sequelize'

interface MonsterAttributes {
  id: number
  name: string
  type: number
  sub_type?: number | null
  ca: number
  defense: string
  health: number
  health_now?: number | null
  size: number
  initiative: number
  displacement: string
  attack_special?: string | null
  special_qualities?: string | null
  grab: number
  fort: number
  reflex: number
  will: number
  skills?: string | null
  feats?: string | null
  challenge: number
  alignment_id: number
  notes?: string | null
  monster_url?: string | null
  is_ativo: boolean
  created_at: Date
  updated_at: Date
}

class Monster extends Model<MonsterAttributes> {
  declare id: number
  declare name: string
  declare type: number
  declare sub_type: number | null
  declare ca: number
  declare defense: string
  declare health: number
  declare health_now: number | null
  declare size: number
  declare initiative: number
  declare displacement: string
  declare attack_special: string | null
  declare special_qualities: string | null
  declare grab: number
  declare fort: number
  declare reflex: number
  declare will: number
  declare skills: string | null
  declare feats: string | null
  declare challenge: number
  declare alignment_id: number
  declare notes: string | null
  declare monster_url: string | null
  declare is_ativo: boolean
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

export const initMonster = (sequelize: Sequelize): ModelStatic<Monster> => {
  Monster.init(
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
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sub_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ca: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      defense: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      health: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      health_now: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      size: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      initiative: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      displacement: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      attack_special: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      special_qualities: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      grab: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fort: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reflex: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      will: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      skills: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      feats: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      challenge: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      alignment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'alignments',
          key: 'id',
        },
      },
      notes: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      monster_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
      tableName: 'monsters',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )
  return Monster
}

export { Monster }
