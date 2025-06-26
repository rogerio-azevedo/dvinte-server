import { Sequelize, Model, DataTypes, ModelStatic } from 'sequelize'

interface CharacterWeaponAttributes {
  id: number
  character_id: number
  weapon_id: number
  hit: number
  damage: number
  element: number
  crit_mod: number
  crit_from_mod: number
  dex_damage: boolean
  price: number
  nickname: string | null
  description: string | null
  created_at: Date
  updated_at: Date
}

class CharacterWeapon extends Model<CharacterWeaponAttributes> {
  declare id: number
  declare character_id: number
  declare weapon_id: number
  declare hit: number
  declare damage: number
  declare element: number
  declare crit_mod: number
  declare crit_from_mod: number
  declare dex_damage: boolean
  declare price: number
  declare nickname: string | null
  declare description: string | null
  declare readonly created_at: Date
  declare readonly updated_at: Date

  static associate(models: any): void {
    this.belongsTo(models.Character, {
      foreignKey: 'character_id',
      as: 'character',
    })

    this.belongsTo(models.Weapon, {
      foreignKey: 'weapon_id',
      as: 'weapon',
    })
  }
}

const initCharacterWeapon = (
  sequelize: Sequelize
): ModelStatic<CharacterWeapon> => {
  CharacterWeapon.init(
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
      weapon_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      hit: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      damage: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      element: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      crit_mod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      crit_from_mod: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      dex_damage: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
      modelName: 'CharacterWeapon',
      tableName: 'character_weapons',
      underscored: true,
    }
  )

  return CharacterWeapon
}

export { CharacterWeapon as default, initCharacterWeapon }
