import {
  Sequelize,
  Model,
  DataTypes,
  ModelStatic,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
} from 'sequelize'
import type Character from './Character'
import type Equipment from './Equipment'

class CharacterEquipment extends Model<
  InferAttributes<CharacterEquipment>,
  InferCreationAttributes<CharacterEquipment>
> {
  declare id: CreationOptional<number>
  declare character_id: ForeignKey<Character['id']>
  declare equipment_id: ForeignKey<Equipment['id']>
  declare quantity: number
  declare price: number
  declare nickname: string | null
  declare description: string | null
  declare readonly created_at: CreationOptional<Date>
  declare readonly updated_at: CreationOptional<Date>

  // Associations
  declare character?: NonAttribute<Character>
  declare equipment?: NonAttribute<Equipment>

  static associate(models: any): void {
    this.belongsTo(models.Character, {
      foreignKey: 'character_id',
      as: 'character',
    })

    this.belongsTo(models.Equipment, {
      foreignKey: 'equipment_id',
      as: 'equipment',
    })
  }
}

const initCharacterEquipment = (
  sequelize: Sequelize
): ModelStatic<CharacterEquipment> => {
  CharacterEquipment.init(
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
      equipment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      nickname: DataTypes.STRING,
      description: DataTypes.TEXT,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'CharacterEquipment',
      tableName: 'character_equipments',
      underscored: true,
    }
  )

  return CharacterEquipment
}

export { CharacterEquipment as default, initCharacterEquipment }
