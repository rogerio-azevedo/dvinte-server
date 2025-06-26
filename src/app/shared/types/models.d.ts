import { Model, Optional } from 'sequelize'

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

export interface CharacterInstance
  extends Model<CharacterAttributes>,
    CharacterAttributes {}

export type CharacterCreationAttributes = Optional<
  CharacterAttributes,
  'id' | 'created_at' | 'updated_at'
>

export interface CharacterClassAttributes {
  id?: number
  character_id: number
  class_id: number
  level: number
  created_at?: Date
  updated_at?: Date
}

export interface CharacterClassInstance
  extends Model<CharacterClassAttributes>,
    CharacterClassAttributes {}

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

export interface CharacterWeaponInstance
  extends Model<CharacterWeaponAttributes>,
    CharacterWeaponAttributes {}

export interface CharacterArmorAttributes {
  id?: number
  character_id: number
  armor_id: number
  ac_bonus: number
  max_dex: number
  check_penalty: number
  spell_failure: number
  speed: number
  price: number
  nickname?: string
  description?: string
  created_at?: Date
  updated_at?: Date
}

export interface CharacterArmorInstance
  extends Model<CharacterArmorAttributes>,
    CharacterArmorAttributes {}

export interface CharacterEquipmentAttributes {
  id?: number
  character_id: number
  equipment_id: number
  quantity: number
  price: number
  nickname?: string
  description?: string
  created_at?: Date
  updated_at?: Date
}

export interface CharacterEquipmentInstance
  extends Model<CharacterEquipmentAttributes>,
    CharacterEquipmentAttributes {}
