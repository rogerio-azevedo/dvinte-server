// Interfaces para os modelos do Sequelize
export interface UserAttributes {
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

export interface CharacterAttributes {
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

export interface RaceAttributes {
  id?: number
  name: string
  created_at?: Date
  updated_at?: Date
}

export interface ClassAttributes {
  id?: number
  name: string
  attack?: string
  fortitude?: string
  reflex?: string
  will?: string
  created_at?: Date
  updated_at?: Date
}

export interface AlignmentAttributes {
  id?: number
  name: string
  created_at?: Date
  updated_at?: Date
}

export interface DivinityAttributes {
  id?: number
  name: string
  created_at?: Date
  updated_at?: Date
}

export interface WeaponAttributes {
  id?: number
  name: string
  dice_s: number
  dice_m: number
  multiplier_s: number
  multiplier_m: number
  critical: number
  crit_from: number
  range: number
  type: string
  material?: string
  weight: number
  price?: number
  str_bonus: number
  book: string
  version: string
  created_at?: Date
  updated_at?: Date
}

export interface ArmorAttributes {
  id?: number
  name: string
  type: number
  bonus: number
  dexterity: number
  penalty: number
  magic: number
  displacement_s: number
  displacement_m: number
  weight: number
  price: number
  book: string
  version: string
  created_at?: Date
  updated_at?: Date
}

export interface EquipmentAttributes {
  id: number
  name: string
  description: string | null
  str_temp: number
  dex_temp: number
  con_temp: number
  int_temp: number
  wis_temp: number
  cha_temp: number
  price: number
  weight: number
  book: string | null
  version: string | null
  created_at: Date
  updated_at: Date
}

export interface PortraitAttributes {
  id?: number
  name: string
  path: string
  url?: string
  created_at?: Date
  updated_at?: Date
}

export interface GameMapAttributes {
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

export interface TokenAttributes {
  id?: number
  name: string
  path: string
  url?: string
  created_at?: Date
  updated_at?: Date
}

export interface CharacterTokenAttributes {
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

export interface CharacterWeaponAttributes {
  id?: number
  character_id: number
  weapon_id: number
  hit: number
  damage: number
  element: number
  crit_mod: number
  crit_from_mod: number
  dex_damage: boolean
  price: number
  nickname?: string
  description?: string
  created_at?: Date
  updated_at?: Date
}
