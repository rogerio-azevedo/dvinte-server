import Alignment from '../models/Alignment'
import Monster from '../models/Monster'
import MonsterAttributes from '../models/MonsterAttributes'
import MonsterAttack from '../models/MonsterAttack'

import getMonsterType from '../../util/getMonsterType'
import getMonsterSubType from '../../util/getMonsterSubType'
import getSize from '../../util/getSize'

class MonsterController {
  async index(req, res) {
    const data = await Monster.findAll({
      include: [
        {
          model: Alignment,
          as: 'alignment',
          attributes: ['name'],
        },
        {
          model: MonsterAttributes,
          as: 'monster_attribute',
        },
        {
          model: MonsterAttack,
          as: 'monster_attack',
        },
      ],
    })

    const monsters = data.map(monster => ({
      code: monster?.id,
      name: monster?.name,
      health: Number(monster?.health),
      health_now: Number(monster?.health),
      initiative: Number(monster?.initiative),
      displacement: Number(monster?.displacement),
      ca: Number(monster?.ca),
      defense: monster?.defense,
      grab: Number(monster?.grab),
      challenge: Number(monster?.challenge),
      monster_url: monster?.monster_url,
      type: getMonsterType(monster?.type),
      sub_type: getMonsterSubType(monster?.subType),
      size: getSize(monster?.size),
      alignment: monster?.alignment?.name,
      is_ativo: monster?.is_ativo,
      monster_attack:
        monster?.monster_attack?.map(c => ({
          id: c.id || 0,
          name: c.name.toUpperCase() || '',
          dice: c.dice || 0,
          multiplier: c.multiplier || 0,
          critical: c.critical || 0,
          crit_from: c.crit_from || 0,
          range: c.range || 0,
          hit: c.hit || 0,
          damage: c.damage || 0,
        })) || [],
    }))

    return res.json(data)
  }

  async show(req, res) {
    const data = await Monster.findByPk(req.params.id, {
      include: [
        {
          model: Alignment,
          as: 'alignment',
          attributes: ['name'],
        },
        {
          model: MonsterAttributes,
          as: 'monster_attribute',
        },
        {
          model: MonsterAttack,
          as: 'monster_attack',
        },
      ],
    })

    const monster = {
      name: data?.name,
      health: Number(data?.health),
      health_now: Number(data?.health),
      initiative: Number(data?.initiative),
      displacement: Number(data?.displacement),
      ca: Number(data?.ca),
      defense: data?.defense,
      grab: Number(data?.grab),
      challenge: Number(data?.challenge),
      attack_special: data?.attack_special,
      special_qualities: data?.special_qualities,
      fort: Number(data?.fort),
      reflex: Number(data?.reflex),
      will: Number(data?.will),
      skills: data?.skills,
      feats: data?.feats,
      notes: data?.notes,
      monster_url: data?.monster_url,
      type: getMonsterType(data?.type),
      sub_type: getMonsterSubType(data?.subType || 0),
      size: getSize(data?.size),
      alignment: data?.alignment.name,
      str: data?.monster_attribute?.strength || 0,
      dex: data?.monster_attribute?.dexterity || 0,
      con: data?.monster_attribute?.constitution || 0,
      int: data?.monster_attribute?.intelligence || 0,
      wis: data?.monster_attribute?.wisdom || 0,
      cha: data?.monster_attribute?.charisma || 0,
      is_ativo: data?.is_ativo,

      attacks:
        data?.monster_attack?.map(c => ({
          id: c.id || 0,
          name: c.name.toUpperCase() || '',
          dice: c.dice || 0,
          multiplier: c.multiplier || 0,
          critical: c.critical || 0,
          crit_from: c.crit_from || 0,
          range: c.range || 0,
          hit: c.hit || 0,
          damage: c.damage || 0,
        })) || [],
    }

    return res.json(monster)
  }

  async store(req, res) {
    const { data, attacks } = req.body

    const newMonster = {
      name: data?.name,
      health: Number(data?.health),
      health_now: Number(data?.health),
      initiative: Number(data?.initiative),
      displacement: Number(data?.displacement),
      ca: Number(data?.ca),
      defense: data?.defense,
      grab: Number(data?.grab),
      challenge: Number(data?.challenge),
      attack_special: data?.attack_special,
      special_qualities: data?.special_qualities,
      fort: Number(data?.fort),
      reflex: Number(data?.reflex),
      will: Number(data?.will),
      skills: data?.skills,
      feats: data?.feats,
      notes: data?.notes,
      monster_url: data?.monster_url,
      type: data?.type,
      sub_type: data?.subType,
      size: data?.size,
      alignment_id: data?.alignment,
      is_ativo: data?.is_ativo,
    }

    const addMonster = await Monster.create(newMonster)

    const monsterAttrs = {
      monster_id: addMonster.id,
      strength: data?.strength,
      dexterity: data?.dexterity,
      constitution: data?.constitution,
      intelligence: data?.intelligence,
      wisdom: data?.wisdom,
      charisma: data?.charisma,
    }

    await MonsterAttributes.create(monsterAttrs)

    const newAttacks = attacks.map(att => ({
      monster_id: addMonster.id,
      name: att.name,
      dice: Number(att.dice),
      multiplier: Number(att.multiplier),
      critical: Number(att.critical),
      crit_from: Number(att.crit_from),
      range: Number(att.range),
      hit: Number(att.hit),
      damage: Number(att.damage),
    }))

    await MonsterAttack.bulkCreate(newAttacks)

    return res.json(addMonster)
  }
}

export default new MonsterController()
