import {
  Model,
  Sequelize,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize'
import type Character from './Character'

export default class Equipment extends Model<
  InferAttributes<Equipment>,
  InferCreationAttributes<Equipment>
> {
  declare id: CreationOptional<number>
  declare name: string
  declare description: string | null
  declare str_temp: number
  declare dex_temp: number
  declare con_temp: number
  declare int_temp: number
  declare wis_temp: number
  declare cha_temp: number
  declare attack_bonus: number
  declare damage_bonus: number
  declare armor_class_bonus: number
  declare fortitude_bonus: number
  declare reflex_bonus: number
  declare will_bonus: number
  declare price: number
  declare weight: number
  declare book: string | null
  declare version: string | null
  declare readonly created_at: CreationOptional<Date>
  declare readonly updated_at: CreationOptional<Date>

  // Associations
  declare characters?: NonAttribute<Character[]>

  static associate(models: any): void {
    this.belongsToMany(models.Character, {
      through: models.CharacterEquipment,
      foreignKey: 'equipment_id',
      as: 'characters',
    })
  }
}

export function initEquipment(sequelize: Sequelize) {
  Equipment.init(
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
      description: DataTypes.STRING,
      str_temp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      dex_temp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      con_temp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      int_temp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      wis_temp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      cha_temp: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      attack_bonus: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      damage_bonus: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      armor_class_bonus: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      fortitude_bonus: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      reflex_bonus: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      will_bonus: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      price: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      weight: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      book: DataTypes.STRING,
      version: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Equipment',
      tableName: 'equipments',
      underscored: true,
    }
  )

  return Equipment
}
