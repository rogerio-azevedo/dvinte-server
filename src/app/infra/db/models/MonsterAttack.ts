import { Sequelize, Model, DataTypes, ModelStatic } from 'sequelize'

interface MonsterAttackAttributes {
  id: number
  monster_id: number
  name: string
  dice: number
  multiplier: number
  critical: number
  crit_from: number
  range: number
  hit: number
  damage: number
  created_at: Date
  updated_at: Date
}

class MonsterAttack extends Model<MonsterAttackAttributes> {
  declare id: number
  declare monster_id: number
  declare name: string
  declare dice: number
  declare multiplier: number
  declare critical: number
  declare crit_from: number
  declare range: number
  declare hit: number
  declare damage: number
  declare readonly created_at: Date
  declare readonly updated_at: Date

  static associate(models: any): void {
    this.belongsTo(models.Monster, {
      foreignKey: 'monster_id',
      as: 'monster',
    })
  }
}

export const initMonsterAttack = (
  sequelize: Sequelize
): ModelStatic<MonsterAttack> => {
  MonsterAttack.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      monster_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'monsters',
          key: 'id',
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      multiplier: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      critical: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      crit_from: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      range: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      hit: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      damage: {
        type: DataTypes.INTEGER,
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
      tableName: 'monster_attacks',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )

  return MonsterAttack
}

export { MonsterAttack }
