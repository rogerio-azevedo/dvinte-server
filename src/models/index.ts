import { Sequelize, DataTypes, Model, ModelStatic } from 'sequelize'
import database from '../database/index.js'

// Types
interface UserAttributes {
  id?: number
  name: string
  email: string
  phone?: string
  city?: string
  state?: string
  password_hash: string
  is_ativo?: boolean
  is_gm?: boolean
  created_at?: Date
  updated_at?: Date
}

interface CharacterAttributes {
  id?: number
  name: string
  age?: number
  gender?: number
  skin?: string
  eye?: string
  hair?: string
  height?: string
  weight?: string
  level: number
  size?: number
  exp?: number
  health?: number
  health_now?: number
  is_ativo?: boolean
  user_id: number
  portrait_id?: number
  alignment_id?: number
  race_id?: number
  divinity_id?: number
  created_at?: Date
  updated_at?: Date
}

interface RaceAttributes {
  id?: number
  name: string
  created_at?: Date
  updated_at?: Date
}

interface ClassAttributes {
  id?: number
  name: string
  attack?: string
  fortitude?: string
  reflex?: string
  will?: string
  created_at?: Date
  updated_at?: Date
}

interface AlignmentAttributes {
  id?: number
  name: string
  created_at?: Date
  updated_at?: Date
}

interface DivinityAttributes {
  id?: number
  name: string
  created_at?: Date
  updated_at?: Date
}

interface WeaponAttributes {
  id?: number
  name: string
  damage?: string
  type?: string
  range?: string
  created_at?: Date
  updated_at?: Date
}

interface ArmorAttributes {
  id?: number
  name: string
  ac?: number
  type?: string
  created_at?: Date
  updated_at?: Date
}

interface EquipmentAttributes {
  id?: number
  name: string
  description?: string
  created_at?: Date
  updated_at?: Date
}

interface PortraitAttributes {
  id?: number
  name: string
  path: string
  url?: string
  created_at?: Date
  updated_at?: Date
}

interface GameMapAttributes {
  id?: number
  campaign_id?: number
  battle: string
  world?: string
  width?: number
  height?: number
  grid?: boolean
  fog?: boolean
  gm_layer?: boolean
  owner?: number
  created_at?: Date
  updated_at?: Date
}

interface TokenAttributes {
  id?: number
  name: string
  path: string
  url?: string
  created_at?: Date
  updated_at?: Date
}

interface CharacterTokenAttributes {
  id?: number
  character_id?: number
  token_id?: number
  x?: number
  y?: number
  width?: number
  height?: number
  rotation?: number
  enabled?: boolean
  created_at?: Date
  updated_at?: Date
}

// Model Classes
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

class Character
  extends Model<CharacterAttributes>
  implements CharacterAttributes
{
  declare id: number
  declare name: string
  declare age: number
  declare gender: number
  declare skin: string
  declare eye: string
  declare hair: string
  declare height: string
  declare weight: string
  declare level: number
  declare size: number
  declare exp: number
  declare health: number
  declare health_now: number
  declare is_ativo: boolean
  declare user_id: number
  declare portrait_id: number
  declare alignment_id: number
  declare race_id: number
  declare divinity_id: number
  declare readonly created_at: Date
  declare readonly updated_at: Date

  // Associations
  declare race?: Race
  declare alignment?: Alignment
  declare divinity?: Divinity
  declare classes?: Class[]
}

class Race extends Model<RaceAttributes> implements RaceAttributes {
  public id!: number
  public name!: string
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

class Class extends Model<ClassAttributes> implements ClassAttributes {
  public id!: number
  public name!: string
  public attack!: string
  public fortitude!: string
  public reflex!: string
  public will!: string
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

class Alignment
  extends Model<AlignmentAttributes>
  implements AlignmentAttributes
{
  public id!: number
  public name!: string
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

class Divinity extends Model<DivinityAttributes> implements DivinityAttributes {
  public id!: number
  public name!: string
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

class Weapon extends Model<WeaponAttributes> implements WeaponAttributes {
  public id!: number
  public name!: string
  public damage!: string
  public type!: string
  public range!: string
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

class Armor extends Model<ArmorAttributes> implements ArmorAttributes {
  public id!: number
  public name!: string
  public ac!: number
  public type!: string
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

class Equipment
  extends Model<EquipmentAttributes>
  implements EquipmentAttributes
{
  public id!: number
  public name!: string
  public description!: string
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

class Portrait extends Model<PortraitAttributes> implements PortraitAttributes {
  public id!: number
  public name!: string
  public path!: string
  public url!: string
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

class GameMap extends Model<GameMapAttributes> implements GameMapAttributes {
  declare id: number
  declare campaign_id: number
  declare battle: string
  declare world: string
  declare width: number
  declare height: number
  declare grid: boolean
  declare fog: boolean
  declare gm_layer: boolean
  declare owner: number
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

class Token extends Model<TokenAttributes> implements TokenAttributes {
  declare id: number
  declare name: string
  declare path: string
  declare url: string
  declare readonly created_at: Date
  declare readonly updated_at: Date
}

class CharacterToken
  extends Model<CharacterTokenAttributes>
  implements CharacterTokenAttributes
{
  declare id: number
  declare character_id: number
  declare token_id: number
  declare x: number
  declare y: number
  declare width: number
  declare height: number
  declare rotation: number
  declare enabled: boolean
  declare readonly created_at: Date
  declare readonly updated_at: Date

  // Associations
  declare tokens?: Token
  declare character?: Character
}

// Initialize models
const sequelize = database.connection

// User model
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

// Character model
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
  },
  {
    sequelize,
    modelName: 'Character',
    tableName: 'characters',
    underscored: true,
  }
)

// Race model
Race.init(
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
  },
  {
    sequelize,
    modelName: 'Race',
    tableName: 'races',
    underscored: true,
  }
)

// Class model
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

// Alignment model
Alignment.init(
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
  },
  {
    sequelize,
    modelName: 'Alignment',
    tableName: 'alignments',
    underscored: true,
  }
)

// Divinity model
Divinity.init(
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
  },
  {
    sequelize,
    modelName: 'Divinity',
    tableName: 'divinities',
    underscored: true,
  }
)

// Weapon model
Weapon.init(
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
    damage: DataTypes.STRING,
    type: DataTypes.STRING,
    range: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'Weapon',
    tableName: 'weapons',
    underscored: true,
  }
)

// Armor model
Armor.init(
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
    ac: DataTypes.INTEGER,
    type: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'Armor',
    tableName: 'armors',
    underscored: true,
  }
)

// Equipment model
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
  },
  {
    sequelize,
    modelName: 'Equipment',
    tableName: 'equipments',
    underscored: true,
  }
)

// Portrait model
Portrait.init(
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
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.VIRTUAL,
      get() {
        const path = this.getDataValue('path')

        // Se for URL do S3, retorna como está
        if (path && (path.includes('s3.') || path.includes('amazonaws.com'))) {
          return path
        }

        // Caso contrário, mantém compatibilidade com arquivos locais antigos
        return `${
          process.env.APP_URL || 'http://localhost:9600'
        }/portrait-files/${path}`
      },
    },
  },
  {
    sequelize,
    modelName: 'Portrait',
    tableName: 'portraits',
    underscored: true,
  }
)

// GameMap model
GameMap.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    campaign_id: DataTypes.INTEGER,
    battle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    world: DataTypes.STRING,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    grid: DataTypes.BOOLEAN,
    fog: DataTypes.BOOLEAN,
    gm_layer: DataTypes.BOOLEAN,
    owner: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: 'GameMap',
    tableName: 'game_maps',
    underscored: true,
  }
)

// Token model
Token.init(
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
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.VIRTUAL,
      get() {
        const path = this.getDataValue('path')

        // Se for URL do S3, retorna como está
        if (path && (path.includes('s3.') || path.includes('amazonaws.com'))) {
          return path
        }

        // Caso contrário, mantém compatibilidade com arquivos locais antigos
        return `${
          process.env.APP_URL || 'http://localhost:9600'
        }/token-files/${path}`
      },
    },
  },
  {
    sequelize,
    modelName: 'Token',
    tableName: 'tokens',
    underscored: true,
  }
)

// CharacterToken model
CharacterToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    character_id: DataTypes.INTEGER,
    token_id: DataTypes.INTEGER,
    x: DataTypes.FLOAT,
    y: DataTypes.FLOAT,
    width: DataTypes.FLOAT,
    height: DataTypes.FLOAT,
    rotation: DataTypes.FLOAT,
    enabled: DataTypes.BOOLEAN,
  },
  {
    sequelize,
    modelName: 'CharacterToken',
    tableName: 'character_tokens',
    underscored: true,
  }
)

// Define associations
Character.belongsTo(User, { foreignKey: 'user_id', as: 'user' })
Character.belongsTo(Race, { foreignKey: 'race_id', as: 'race' })
Character.belongsTo(Alignment, { foreignKey: 'alignment_id', as: 'alignment' })
Character.belongsTo(Divinity, { foreignKey: 'divinity_id', as: 'divinity' })
Character.belongsTo(Portrait, { foreignKey: 'portrait_id', as: 'portrait' })

User.hasMany(Character, { foreignKey: 'user_id', as: 'characters' })
Race.hasMany(Character, { foreignKey: 'race_id', as: 'characters' })
Alignment.hasMany(Character, { foreignKey: 'alignment_id', as: 'characters' })
Divinity.hasMany(Character, { foreignKey: 'divinity_id', as: 'characters' })
Portrait.hasMany(Character, { foreignKey: 'portrait_id', as: 'characters' })

// Token and CharacterToken associations
CharacterToken.belongsTo(Token, { foreignKey: 'token_id', as: 'tokens' })
CharacterToken.belongsTo(Character, {
  foreignKey: 'character_id',
  as: 'character',
})
Token.hasMany(CharacterToken, { foreignKey: 'token_id', as: 'characterTokens' })
Character.hasOne(CharacterToken, {
  foreignKey: 'character_id',
  as: 'characterToken',
})

export {
  User,
  Character,
  Race,
  Class,
  Alignment,
  Divinity,
  Weapon,
  Armor,
  Equipment,
  Portrait,
  GameMap,
  Token,
  CharacterToken,
  sequelize,
}
