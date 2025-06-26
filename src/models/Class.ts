import { Model, Sequelize, DataTypes } from 'sequelize'
import { ClassAttributes } from './interfaces'

class Class extends Model<ClassAttributes> implements ClassAttributes {
  declare id: number
  declare name: string
  declare attack: string
  declare fortitude: string
  declare reflex: string
  declare will: string
  declare readonly created_at: Date
  declare readonly updated_at: Date

  static associate(models: any): void {
    this.belongsToMany(models.Character, {
      through: 'character_classes',
      foreignKey: 'class_id',
      as: 'characters',
    })
  }
}

export function initClass(sequelize: Sequelize) {
  Class.init(
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
      attack: DataTypes.STRING,
      fortitude: DataTypes.STRING,
      reflex: DataTypes.STRING,
      will: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Class',
      tableName: 'classes',
      underscored: true,
    }
  )

  return Class
}
