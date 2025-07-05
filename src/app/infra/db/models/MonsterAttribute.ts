import { Sequelize, Model, DataTypes, ModelStatic } from 'sequelize'

interface MonsterAttributeAttributes {
  id: number
  monster_id: number
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  created_at: Date
  updated_at: Date
}

class MonsterAttribute extends Model<MonsterAttributeAttributes> {
  declare id: number
  declare monster_id: number
  declare strength: number
  declare dexterity: number
  declare constitution: number
  declare intelligence: number
  declare wisdom: number
  declare charisma: number
  declare readonly created_at: Date
  declare readonly updated_at: Date

  static associate(models: any): void {
    this.belongsTo(models.Monster, {
      foreignKey: 'monster_id',
      as: 'monster',
    })
  }
}

export const initMonsterAttribute = (
  sequelize: Sequelize
): ModelStatic<MonsterAttribute> => {
  MonsterAttribute.init(
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
      strength: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dexterity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      constitution: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      intelligence: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      wisdom: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      charisma: {
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
      tableName: 'monster_attributes',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )

  return MonsterAttribute
}

export { MonsterAttribute }
