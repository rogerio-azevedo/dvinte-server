import { Sequelize, Model, DataTypes, ModelStatic } from 'sequelize'

interface AttributeTempAttributes {
  id: number
  character_id: number
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  created_at: Date
  updated_at: Date
}

class AttributeTemp extends Model<AttributeTempAttributes> {
  declare id: number
  declare character_id: number
  declare strength: number
  declare dexterity: number
  declare constitution: number
  declare intelligence: number
  declare wisdom: number
  declare charisma: number
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

export const initAttributeTemp = (
  sequelize: Sequelize
): ModelStatic<AttributeTemp> => {
  AttributeTemp.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      character_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      strength: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      dexterity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      constitution: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      intelligence: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      wisdom: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      charisma: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      tableName: 'attribute_temps',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )

  return AttributeTemp
}
