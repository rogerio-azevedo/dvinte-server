import { Sequelize, Model, DataTypes, ModelStatic } from 'sequelize'

interface CharacterAttributes {
  id: number
  name: string
  age: number | null
  gender: number | null
  skin: string | null
  eye: string | null
  hair: string | null
  height: string | null
  weight: string | null
  level: number
  size: number | null
  exp: number | null
  health: number | null
  health_now: number | null
  is_ativo: boolean
  user_id: number
  portrait_id: number | null
  alignment_id: number | null
  race_id: number | null
  divinity_id: number | null
  created_at: Date
  updated_at: Date
}

class Character extends Model<CharacterAttributes> {
  declare id: number
  declare name: string
  declare age: number | null
  declare gender: number | null
  declare skin: string | null
  declare eye: string | null
  declare hair: string | null
  declare height: string | null
  declare weight: string | null
  declare level: number
  declare size: number | null
  declare exp: number | null
  declare health: number | null
  declare health_now: number | null
  declare is_ativo: boolean
  declare user_id: number
  declare portrait_id: number | null
  declare alignment_id: number | null
  declare race_id: number | null
  declare divinity_id: number | null
  declare readonly created_at: Date
  declare readonly updated_at: Date

  static associate(models: any): void {
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    })

    this.belongsTo(models.Portrait, {
      foreignKey: 'portrait_id',
      as: 'portrait',
    })

    this.hasOne(models.CharacterToken, {
      foreignKey: 'character_id',
      as: 'chartoken',
    })

    this.belongsTo(models.Alignment, {
      foreignKey: 'alignment_id',
      as: 'alignment',
    })

    this.belongsTo(models.Race, {
      foreignKey: 'race_id',
      as: 'race',
    })

    this.belongsTo(models.Divinity, {
      foreignKey: 'divinity_id',
      as: 'divinity',
    })

    this.hasOne(models.Attribute, {
      foreignKey: 'character_id',
      as: 'attribute',
    })

    this.hasOne(models.AttributeTemp, {
      foreignKey: 'character_id',
      as: 'attribute_temp',
    })

    this.belongsToMany(models.Class, {
      through: models.CharacterClass,
      foreignKey: 'character_id',
      as: 'classes',
    })

    this.belongsToMany(models.Armor, {
      through: models.CharacterArmor,
      foreignKey: 'character_id',
      as: 'armors',
    })

    this.belongsToMany(models.Weapon, {
      through: models.CharacterWeapon,
      foreignKey: 'character_id',
      as: 'weapons',
    })

    this.belongsToMany(models.Equipment, {
      through: models.CharacterEquipment,
      foreignKey: 'character_id',
      as: 'equipments',
    })
  }
}

const initCharacter = (sequelize: Sequelize): ModelStatic<Character> => {
  Character.init(
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
      age: DataTypes.INTEGER,
      gender: DataTypes.INTEGER,
      skin: DataTypes.STRING,
      eye: DataTypes.STRING,
      hair: DataTypes.STRING,
      height: DataTypes.STRING,
      weight: DataTypes.STRING,
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      size: DataTypes.INTEGER,
      exp: DataTypes.INTEGER,
      health: DataTypes.INTEGER,
      health_now: DataTypes.INTEGER,
      is_ativo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      portrait_id: DataTypes.INTEGER,
      alignment_id: DataTypes.INTEGER,
      race_id: DataTypes.INTEGER,
      divinity_id: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Character',
      tableName: 'characters',
      underscored: true,
    }
  )

  return Character
}

export { Character as default, initCharacter }
