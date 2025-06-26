import Logs from '../schemas/Logs'
import Character from '../models/Character'
import Portrait from '../models/Portrait'
import Divinity from '../models/Divinity'
import Alignment from '../models/Alignment'
import Race from '../models/Race'
import Attribute from '../models/Attribute'
import AttributeTemp from '../models/AttributeTemp'
import User from '../models/User'
import BaseAttack from '../models/BaseAttack'
import BaseResist from '../models/BaseResist'

import getSize from '../../util/getSize'
import getGender from '../../util/getGender'
import getModifier from '../../util/getModifier'

import { saveMessage } from '../../websocket'
import Character from '../models/Character'

const { format, subDays, addDays } = require('date-fns')
const { utcToZonedTime } = require('date-fns-tz')

const DateBR = utcToZonedTime(new Date(), 'America/Sao_Paulo')
const date1 = subDays(DateBR, 1)
const date2 = addDays(DateBR, 1)

class CombatController {
  async index(req, res) {
    const data1 = format(date1, "yyyy-MM-dd'T00:00:00")
    const data2 = format(date2, "yyyy-MM-dd'T23:59:59")

    const log = await Logs.find({
      createdAt: { $gte: data1, $lte: data2 },
    })

    const mensages = log.map(c => ({
      id: c.id,
      user: c.user,
      date: c.createdAt,
      message: c.message,
      isCrit: c.isCrit,
    }))

    return res.json(mensages)
  }

  async show(req, res) {
    const char = await Character.findOne({
      where: {
        user_id: req.params.id,
        is_ativo: true,
      },
      include: [
        {
          model: Portrait,
          as: 'portrait',
          attributes: ['id', 'path', 'url'],
        },
        {
          model: Divinity,
          as: 'divinity',
          attributes: ['name'],
        },
        {
          model: Alignment,
          as: 'alignment',
          attributes: ['name'],
        },
        {
          model: Race,
          as: 'race',
          attributes: ['name'],
        },
        {
          model: Attribute,
          as: 'attribute',
        },
        {
          model: AttributeTemp,
          as: 'attribute_temp',
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
        {
          association: 'classes',
          attributes: ['name', 'attack', 'fortitude', 'reflex', 'will'],
          through: { attributes: ['level'] },
        },
        {
          association: 'armors',
          attributes: [
            'id',
            'name',
            'type',
            'bonus',
            'dexterity',
            'penalty',
            'magic',
            'displacement_s',
            'displacement_m',
            'weight',
            'price',
            'book',
            'version',
          ],
          through: { attributes: ['defense', 'price', 'description'] },
        },
        {
          association: 'weapons',
          attributes: [
            'id',
            'name',
            'dice_s',
            'dice_m',
            'multiplier_s',
            'multiplier_m',
            'critical',
            'crit_from',
            'range',
            'type',
            'material',
            'weight',
            'str_bonus',
            'price',
            'book',
            'version',
          ],
          through: {
            attributes: [
              'hit',
              'damage',
              'element',
              'crit_mod',
              'crit_from_mod',
              'dex_damage',
              'price',
              'nickname',
              'description',
            ],
          },
        },
        {
          association: 'equipments',
          attributes: [
            'id',
            'name',
            'str_temp',
            'dex_temp',
            'con_temp',
            'int_temp',
            'wis_temp',
            'cha_temp',
            'weight',
            'price',
            'book',
            'version',
          ],
          through: {
            attributes: ['description'],
          },
        },
      ],
    })

    const levels = char?.classes?.map(l => l.CharacterClass?.level) || []

    const baseAtack = await BaseAttack.findAll({
      where: { level: levels },
      raw: true,
      attributes: ['level', 'low', 'medium', 'high'],
    })

    const baseResist = await BaseResist.findAll({
      where: { level: levels },
      raw: true,
      attributes: ['level', 'low', 'high'],
    })

    const charData = {
      Cod: char?.id,
      Name: char?.name.toUpperCase() || '',
      User: char?.user?.name.toUpperCase() || '',
      Level: char?.level || 0,
      Race: char?.race?.name.toUpperCase() || '',
      Health: char?.health || 0,
      HealthNow: char?.health_now || 0,
      Age: char?.age || 0,
      Gender: getGender(char?.gender || 0),
      Size: getSize(char?.size || 0),

      Height: char?.height || '',
      Weight: char?.weight || '',
      Eye: char?.eye.toUpperCase() || '',
      Hair: char?.hair.toUpperCase() || '',
      Skin: char?.skin.toUpperCase() || '',

      Exp: char?.exp || 0,
      Alig: char?.alignment?.name.toUpperCase() || '',
      Divin: char?.divinity?.name.toUpperCase() || '',

      Str: char?.attribute?.strength || 0,
      Dex: char?.attribute?.dexterity || 0,
      Con: char?.attribute?.constitution || 0,
      Int: char?.attribute?.intelligence || 0,
      Wis: char?.attribute?.wisdom || 0,
      Cha: char?.attribute?.charisma || 0,

      StrMod: getModifier(char?.attribute?.strength) || 0,
      DexMod: getModifier(char?.attribute?.dexterity) || 0,
      ConMod: getModifier(char?.attribute?.constitution) || 0,
      IntMod: getModifier(char?.attribute?.intelligence) || 0,
      WisMod: getModifier(char?.attribute?.wisdom) || 0,
      ChaMod: getModifier(char?.attribute?.charisma) || 0,

      StrTemp: char?.attribute_temp?.strength || 0,
      DexTemp: char?.attribute_temp?.dexterity || 0,
      ConTemp: char?.attribute_temp?.constitution || 0,
      IntTemp: char?.attribute_temp?.intelligence || 0,
      WisTemp: char?.attribute_temp?.wisdom || 0,
      ChaTemp: char?.attribute_temp?.charisma || 0,

      StrModTemp: getModifier(char?.attribute_temp?.strength) || 0,
      DexModTemp: getModifier(char?.attribute_temp?.dexterity) || 0,
      ConModTemp: getModifier(char?.attribute_temp?.constitution) || 0,
      IntModTemp: getModifier(char?.attribute_temp?.intelligence) || 0,
      WisModTemp: getModifier(char?.attribute_temp?.wisdom) || 0,
      ChaModTemp: getModifier(char?.attribute_temp?.charisma) || 0,

      Portrait: char?.portrait?.url || '',

      BaseAttack: char?.classes?.reduce((total, c) => {
        const base = baseAtack.find(a => a.level === c.CharacterClass.level)
        return total + ((base && base[c.attack]) || 0)
      }, 0),

      Fortitude: char?.classes?.reduce((total, c) => {
        const base = baseResist.find(a => a.level === c.CharacterClass.level)
        return total + ((base && base[c.fortitude]) || 0)
      }, 0),

      Reflex: char?.classes?.reduce((total, c) => {
        const base = baseResist.find(a => a.level === c.CharacterClass.level)
        return total + ((base && base[c.reflex]) || 0)
      }, 0),

      Will: char?.classes?.reduce((total, c) => {
        const base = baseResist.find(a => a.level === c.CharacterClass.level)
        return total + ((base && base[c.will]) || 0)
      }, 0),

      Classes:
        char?.classes?.map(c => ({
          name: c.name.toUpperCase() || '',
          attack: c.attack || '',
          fortitude: c.fortitude,
          reflex: c.reflex,
          will: c.will,
          level: c.CharacterClass?.level || 0,
        })) || [],

      Armor:
        char?.armors?.map(c => ({
          id: c.id || 0,
          name: c.name.toUpperCase() || '',
          type: c.type || 0,
          bonus: c.bonus || 0,
          dexterity: c.dexterity || 0,
          penalty: c.penalty || 0,
          magic: c.magic || 0,
          displacement_s: c.displacement_s || 0,
          displacement_m: c.displacement_m || 0,
          weight: c.weight || 0,
          price: c.price || 0,
          book: c.book || '',
          version: c.version || '',
          defense: c.CharacterArmor?.defense || 0,
          price: c.CharacterArmor?.price || 0,
          description: c.CharacterArmor?.description || '',
        })) || [],

      Weapon:
        char?.weapons?.map(c => ({
          id: c.id || 0,
          name: c.name.toUpperCase() || '',
          dice_s: c.dice_s || 0,
          dice_m: c.dice_m || 0,
          multiplier_s: c.multiplier_s || 0,
          multiplier_m: c.multiplier_m || 0,
          critical: c.critical || 0,
          crit_from: c.crit_from || 0,
          range: c.range || 0,
          type: c.type || '',
          weight: c.weight || 0,
          material: c.material || '',
          str_bonus: c.str_bonus || 0,
          price: c.price || 0,
          book: c.book || '',
          version: c.version || '',
          hit: c.CharacterWeapon?.hit || 0,
          damage: c.CharacterWeapon?.damage || 0,
          element: c.CharacterWeapon?.element || 0,
          crit_mod: c.CharacterWeapon?.crit_mod || 0,
          crit_from_mod: c.CharacterWeapon?.crit_from_mod || 0,
          dex_damage: c.CharacterWeapon?.dex_damage || false,
          price: c.CharacterWeapon?.price || 0,
          nickname: c.CharacterWeapon?.nickname || '',
          description: c.CharacterWeapon?.description || '',
        })) || [],

      Equipment:
        char?.equipments?.map(c => ({
          id: c.id || 0,
          name: c.name.toUpperCase() || '',
          str_temp: c.str_temp || 0,
          dex_temp: c.dex_temp || 0,
          con_temp: c.con_temp || 0,
          int_temp: c.int_temp || 0,
          wis_temp: c.wis_temp || 0,
          cha_temp: c.cha_temp || 0,
          weight: c.weight || 0,
          price: c.price || 0,
          book: c.book || '',
          version: c.version || '',
          description: c.CharacterEquipment?.description || '',
        })) || [],
    }
    return res.json(charData)
  }

  async store(req, res) {
    const chat = await Logs.create(req.body)

    const message = {
      id: chat.id,
      user: chat.user,
      date: chat.createdAt,
      message: chat.message,
      result: chat.result,
      type: chat.type,
      isCrit: chat?.isCrit,
    }
    saveMessage(message)

    return res.json(chat)
  }
}

export default new CombatController()
