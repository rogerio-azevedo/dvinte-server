import { Model, Sequelize, DataTypes } from 'sequelize'
import { UserAttributes } from './interfaces'

class User extends Model<UserAttributes> implements UserAttributes {
  declare id: number
  declare name: string
  declare email: string
  declare phone: string
  declare city: string
  declare state: string
  declare password_hash: string
  declare is_ativo: boolean
  declare is_gm: boolean
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

export function initUser(sequelize: Sequelize) {
  User.init(
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      is_gm: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
    }
  )

  return User
}
