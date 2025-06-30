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

export const initCharacterEquipment = (
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
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
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

export default CharacterEquipment
