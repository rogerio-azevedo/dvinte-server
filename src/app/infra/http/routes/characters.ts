import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { QueryTypes } from 'sequelize'
import models, { sequelize } from '../../db/models'

// Import utility functions
import { getCharXp } from '../../../shared/utils/getCharXp'
import { getGender } from '../../../shared/utils/getGender'
import { getSize } from '../../../shared/utils/getSize'
import { getModifier } from '../../../shared/utils/getModifier'

// Types
interface CharacterClass {
  name: string
  attack: 'low' | 'medium' | 'high'
  fortitude: 'low' | 'high'
  reflex: 'low' | 'high'
  will: 'low' | 'high'
  CharacterClass: {
    level: number
  }
}

interface CharacterArmor {
  id: number
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
  CharacterArmor?: {
    defense: number
    price: number
    description: string
  }
}

interface CharacterWeapon {
  id: number
  name: string
  dice_s: number
  dice_m: number
  multiplier_s: number
  multiplier_m: number
  critical: number
  crit_from: number
  range: number
  type: string
  weight: number
  material: string
  str_bonus: number
  price: number
  book: string
  version: string
  CharacterWeapon?: {
    hit: number
    damage: number
    element: number
    crit_mod: number
    crit_from_mod: number
    dex_damage: boolean
    price: number
    nickname: string
    description: string
  }
}

interface CharacterEquipment {
  id: number
  name: string
  str_temp: number
  dex_temp: number
  con_temp: number
  int_temp: number
  wis_temp: number
  cha_temp: number
  weight: number
  price: number
  book: string
  version: string
  CharacterEquipment?: {
    description: string
  }
}

interface BaseAttack {
  level: number
  low: number
  medium: number
  high: number
}

interface BaseResist {
  level: number
  low: number
  high: number
}

const characterSchema = z.object({
  name: z.string().min(1),
  level: z.union([z.number(), z.string()]).transform(val => Number(val)),
  race_id: z
    .union([z.number(), z.string(), z.null()])
    .transform(val => (val ? Number(val) : undefined))
    .optional(),
  alignment_id: z
    .union([z.number(), z.string(), z.null()])
    .transform(val => (val ? Number(val) : undefined))
    .optional(),
  divinity_id: z
    .union([z.number(), z.string(), z.null()])
    .transform(val => (val ? Number(val) : undefined))
    .optional(),
  portrait_id: z
    .union([z.number(), z.string(), z.null()])
    .transform(val => (val ? Number(val) : undefined))
    .optional(),
  user_id: z
    .union([z.number(), z.string()])
    .transform(val => Number(val))
    .optional(),
  age: z
    .union([z.number(), z.string(), z.null()])
    .transform(val => (val ? Number(val) : undefined))
    .optional(),
  gender: z
    .union([z.number(), z.string(), z.null()])
    .transform(val => (val ? Number(val) : undefined))
    .optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  skin: z.string().optional(),
  eye: z.string().optional(),
  hair: z.string().optional(),
  size: z
    .union([z.number(), z.string(), z.null()])
    .transform(val => (val ? Number(val) : undefined))
    .optional(),
  exp: z
    .union([z.number(), z.string()])
    .transform(val => Number(val))
    .optional(),
  health: z
    .union([z.number(), z.string(), z.null()])
    .transform(val => (val ? Number(val) : undefined))
    .optional(),
  health_now: z
    .union([z.number(), z.string(), z.null()])
    .transform(val => (val ? Number(val) : undefined))
    .optional(),
  is_ativo: z
    .union([z.boolean(), z.string()])
    .transform(val => (typeof val === 'string' ? val === 'true' : val))
    .optional(),
  attributes: z
    .object({
      str: z.union([z.number(), z.string()]).transform(val => Number(val)),
      dex: z.union([z.number(), z.string()]).transform(val => Number(val)),
      con: z.union([z.number(), z.string()]).transform(val => Number(val)),
      int: z.union([z.number(), z.string()]).transform(val => Number(val)),
      wis: z.union([z.number(), z.string()]).transform(val => Number(val)),
      cha: z.union([z.number(), z.string()]).transform(val => Number(val)),
    })
    .optional(),
  classe: z
    .array(
      z.object({
        class_id: z
          .union([z.number(), z.string()])
          .transform(val => Number(val)),
        level: z.union([z.number(), z.string()]).transform(val => Number(val)),
      })
    )
    .optional(),
})

const characterWeaponSchema = z.object({
  weapon: z.union([z.number(), z.string()]).transform(val => Number(val)),
  hit: z
    .union([z.number(), z.string(), z.null()])
    .transform(val => Number(val || 0)),
  damage: z
    .union([z.number(), z.string(), z.null()])
    .transform(val => Number(val || 0)),
  element: z
    .union([z.number(), z.string(), z.null()])
    .transform(val => Number(val || 0)),
  crit_mod: z
    .union([z.number(), z.string(), z.null()])
    .transform(val => Number(val || 0)),
  crit_from_mod: z
    .union([z.number(), z.string(), z.null()])
    .transform(val => Number(val || 0)),
  dex_damage: z.union([z.boolean(), z.string(), z.null()]).transform(val => {
    if (val === null || val === undefined) return false
    return typeof val === 'string' ? val === 'true' : Boolean(val)
  }),
  price: z
    .union([z.number(), z.string(), z.null()])
    .transform(val => Number(val || 0)),
  nickname: z
    .string()
    .nullish()
    .transform(val => val || ''),
  description: z
    .string()
    .nullish()
    .transform(val => val || ''),
})

export default async function characterRoutes(fastify: FastifyInstance) {
  // Get all characters
  fastify.get('/characters', async (request, reply) => {
    try {
      const characters = await models.Character.findAll({
        include: [
          { model: models.Race, as: 'race' },
          { model: models.Alignment, as: 'alignment' },
          { model: models.Divinity, as: 'divinity' },
          { model: models.User, as: 'user', attributes: ['id', 'name'] },
          { model: models.Portrait, as: 'portrait' },
        ],
        where: { is_ativo: true },
        order: [['created_at', 'DESC']],
      })

      // Transform data for frontend compatibility
      const transformedCharacters = characters.map((char: any) => {
        const charData = char.toJSON()
        return {
          ...charData,
          race: charData.race?.name || '',
          alignment: charData.alignment?.name || '',
          divinity: charData.divinity?.name || '',
          user: charData.user?.name || '',
          portrait: charData.portrait?.url || '',
        }
      })

      return reply.send(transformedCharacters)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch characters' })
    }
  })

  // Get character by ID
  fastify.get('/characters/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const character = await models.Character.findByPk(parseInt(id), {
        include: [
          {
            model: models.Portrait,
            as: 'portrait',
            attributes: ['id', 'path', 'url'],
          },
          { model: models.Divinity, as: 'divinity', attributes: ['name'] },
          { model: models.Alignment, as: 'alignment', attributes: ['name'] },
          { model: models.Race, as: 'race', attributes: ['name'] },
          { model: models.Attribute, as: 'attribute' },
          { model: models.AttributeTemp, as: 'attribute_temp' },
          { model: models.User, as: 'user', attributes: ['name'] },
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
            through: { attributes: ['defense', 'description', 'price'] },
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
            through: { attributes: ['description'] },
          },
        ],
      })

      if (!character) {
        return reply.code(404).send({ error: 'Character not found' })
      }

      // Buscar níveis para cálculos de ataque base e resistências
      const levels = character.classes?.map(
        (c: CharacterClass) => c.CharacterClass.level
      )

      const baseAtack = await models.BaseAttack.findAll({
        where: { level: levels },
        raw: true,
        attributes: ['level', 'low', 'medium', 'high'],
      })

      const baseResist = await models.BaseResist.findAll({
        where: { level: levels },
        raw: true,
        attributes: ['level', 'low', 'high'],
      })

      // Transformar dados para o formato esperado pelo frontend
      const charData = {
        Cod: character.id,
        Name: character.name?.toUpperCase() || '',
        User: character.user?.name?.toUpperCase() || '',
        Level: character.level || 0,
        Race: character.race?.name?.toUpperCase() || '',
        Health: character.health || 0,
        HealthNow: character.health_now || 0,
        Age: character.age || 0,
        Gender: getGender(character.gender || 0),
        Size: getSize(character.size || 0),

        Height: character.height || '',
        Weight: character.weight || '',
        Eye: character.eye?.toUpperCase() || '',
        Hair: character.hair?.toUpperCase() || '',
        Skin: character.skin?.toUpperCase() || '',

        Exp: character.exp || 0,
        Alig: character.alignment?.name?.toUpperCase() || '',
        Divin: character.divinity?.name?.toUpperCase() || '',

        Str: character.attribute?.strength || 0,
        Dex: character.attribute?.dexterity || 0,
        Con: character.attribute?.constitution || 0,
        Int: character.attribute?.intelligence || 0,
        Wis: character.attribute?.wisdom || 0,
        Cha: character.attribute?.charisma || 0,

        StrMod: getModifier(character.attribute?.strength) || 0,
        DexMod: getModifier(character.attribute?.dexterity) || 0,
        ConMod: getModifier(character.attribute?.constitution) || 0,
        IntMod: getModifier(character.attribute?.intelligence) || 0,
        WisMod: getModifier(character.attribute?.wisdom) || 0,
        ChaMod: getModifier(character.attribute?.charisma) || 0,

        StrTemp: character.attribute_temp?.strength || 0,
        DexTemp: character.attribute_temp?.dexterity || 0,
        ConTemp: character.attribute_temp?.constitution || 0,
        IntTemp: character.attribute_temp?.intelligence || 0,
        WisTemp: character.attribute_temp?.wisdom || 0,
        ChaTemp: character.attribute_temp?.charisma || 0,

        StrModTemp: getModifier(character.attribute_temp?.strength) || 0,
        DexModTemp: getModifier(character.attribute_temp?.dexterity) || 0,
        ConModTemp: getModifier(character.attribute_temp?.constitution) || 0,
        IntModTemp: getModifier(character.attribute_temp?.intelligence) || 0,
        WisModTemp: getModifier(character.attribute_temp?.wisdom) || 0,
        ChaModTemp: getModifier(character.attribute_temp?.charisma) || 0,

        Portrait: character.portrait?.url || '',

        BaseAttack:
          character.classes?.reduce((total: number, c: CharacterClass) => {
            const base = baseAtack.find(a => a.level === c.CharacterClass.level)
            return total + ((base && base[c.attack]) || 0)
          }, 0) || 0,

        Fortitude:
          character.classes?.reduce((total: number, c: CharacterClass) => {
            const base = baseResist.find(
              a => a.level === c.CharacterClass.level
            )
            return total + ((base && base[c.fortitude]) || 0)
          }, 0) || 0,

        Reflex:
          character.classes?.reduce((total: number, c: CharacterClass) => {
            const base = baseResist.find(
              a => a.level === c.CharacterClass.level
            )
            return total + ((base && base[c.reflex]) || 0)
          }, 0) || 0,

        Will:
          character.classes?.reduce((total: number, c: CharacterClass) => {
            const base = baseResist.find(
              a => a.level === c.CharacterClass.level
            )
            return total + ((base && base[c.will]) || 0)
          }, 0) || 0,

        Classes:
          character.classes?.map((c: CharacterClass) => ({
            name: c.name?.toUpperCase() || '',
            attack: c.attack || '',
            fortitude: c.fortitude,
            reflex: c.reflex,
            will: c.will,
            level: c.CharacterClass?.level || 0,
          })) || [],

        Armor:
          character.armors?.map((c: CharacterArmor) => ({
            id: c.id || 0,
            name: c.name?.toUpperCase() || '',
            type: c.type || 0,
            bonus: c.bonus || 0,
            dexterity: c.dexterity || 0,
            penalty: c.penalty || 0,
            magic: c.magic || 0,
            displacement_s: c.displacement_s || 0,
            displacement_m: c.displacement_m || 0,
            weight: c.weight || 0,
            price: c.CharacterArmor?.price || 0,
            book: c.book || '',
            version: c.version || '',
            defense: c.CharacterArmor?.defense || 0,
            description: c.CharacterArmor?.description || '',
          })) || [],

        Weapon:
          character.weapons?.map((c: CharacterWeapon) => ({
            id: c.id || 0,
            name: c.name?.toUpperCase() || '',
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
            price: c.CharacterWeapon?.price || 0,
            book: c.book || '',
            version: c.version || '',
            hit: c.CharacterWeapon?.hit || 0,
            damage: c.CharacterWeapon?.damage || 0,
            element: c.CharacterWeapon?.element || 0,
            crit_mod: c.CharacterWeapon?.crit_mod || 0,
            crit_from_mod: c.CharacterWeapon?.crit_from_mod || 0,
            dex_damage: c.CharacterWeapon?.dex_damage || false,
            nickname: c.CharacterWeapon?.nickname || '',
            description: c.CharacterWeapon?.description || '',
          })) || [],

        Equipment:
          character.equipments?.map((c: CharacterEquipment) => ({
            id: c.id || 0,
            name: c.name?.toUpperCase() || '',
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

      return reply.send(charData)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch character' })
    }
  })

  // Create character
  fastify.post('/characters', async (request, reply) => {
    try {
      const data = characterSchema.parse(request.body)

      fastify.log.info(
        'Creating character with data:',
        JSON.stringify(data, null, 2)
      )

      // Create character with all data including portrait_id
      const charData = {
        name: data.name,
        age: data.age,
        gender: data.gender,
        skin: data.skin,
        eye: data.eye,
        hair: data.hair,
        height: data.height,
        weight: data.weight,
        level: data.level,
        health: data.health,
        health_now: data.health_now,
        exp: getCharXp(data.level),
        size: data.size,
        user_id: data.user_id!,
        portrait_id: data.portrait_id,
        alignment_id: data.alignment_id,
        race_id: data.race_id,
        divinity_id: data.divinity_id,
        is_ativo: data.is_ativo !== undefined ? data.is_ativo : true,
      }

      fastify.log.info(
        'Character data to be created:',
        JSON.stringify(charData, null, 2)
      )
      const character = await models.Character.create(charData)
      fastify.log.info(`Character created with ID: ${character.id}`)

      // Create attributes if provided
      if (data.attributes) {
        const attrData = {
          character_id: character.id,
          strength: data.attributes.str,
          dexterity: data.attributes.dex,
          constitution: data.attributes.con,
          intelligence: data.attributes.int,
          wisdom: data.attributes.wis,
          charisma: data.attributes.cha,
          created_at: new Date(),
          updated_at: new Date(),
        }

        fastify.log.info(
          'Creating attributes:',
          JSON.stringify(attrData, null, 2)
        )

        // Use direct Sequelize query to avoid model initialization issues
        await sequelize.query(
          `INSERT INTO attributes (character_id, strength, dexterity, constitution, intelligence, wisdom, charisma, created_at, updated_at) 
           VALUES (:character_id, :strength, :dexterity, :constitution, :intelligence, :wisdom, :charisma, :created_at, :updated_at)`,
          {
            replacements: attrData,
            type: QueryTypes.INSERT,
          }
        )
        fastify.log.info('Attributes created successfully')
      }

      // Create character classes if provided
      if (data.classe && data.classe.length > 0) {
        fastify.log.info(
          'Creating character classes:',
          JSON.stringify(data.classe, null, 2)
        )

        // Create each class individually using raw query
        for (const classItem of data.classe) {
          const classData = {
            character_id: character.id,
            class_id: classItem.class_id,
            level: classItem.level,
            created_at: new Date(),
            updated_at: new Date(),
          }

          await sequelize.query(
            `INSERT INTO character_classes (character_id, class_id, level, created_at, updated_at) 
             VALUES (:character_id, :class_id, :level, :created_at, :updated_at)`,
            {
              replacements: classData,
              type: QueryTypes.INSERT,
            }
          )
        }
        fastify.log.info('Character classes created successfully')
      }

      // Fetch the created character with all associations
      const createdCharacter = await models.Character.findByPk(character.id, {
        include: [
          { model: models.Race, as: 'race' },
          { model: models.Alignment, as: 'alignment' },
          { model: models.Divinity, as: 'divinity' },
          { model: models.User, as: 'user', attributes: ['id', 'name'] },
          { model: models.Portrait, as: 'portrait' },
        ],
      })

      fastify.log.info('Character creation completed successfully')
      return reply.code(201).send(createdCharacter)
    } catch (error) {
      fastify.log.error('Error creating character:', error)
      return reply.code(400).send({
        error: 'Failed to create character',
        details: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  })

  // Update character
  fastify.put('/characters/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const characterData = characterSchema.partial().parse(request.body)

      const character = await models.Character.findByPk(parseInt(id))

      if (!character) {
        return reply.code(404).send({ error: 'Character not found' })
      }

      await character.update(characterData)

      // Fetch updated character with associations
      const updatedCharacter = await models.Character.findByPk(character.id, {
        include: [
          { model: models.Race, as: 'race' },
          { model: models.Alignment, as: 'alignment' },
          { model: models.Divinity, as: 'divinity' },
          { model: models.User, as: 'user', attributes: ['id', 'name'] },
          { model: models.Portrait, as: 'portrait' },
        ],
      })

      return reply.send(updatedCharacter)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(400).send({ error: 'Failed to update character' })
    }
  })

  // Delete character (soft delete)
  fastify.delete('/characters/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      const character = await models.Character.findByPk(parseInt(id))

      if (!character) {
        return reply.code(404).send({ error: 'Character not found' })
      }

      await character.update({ is_ativo: false })

      return reply.send({ message: 'Character deleted successfully' })
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to delete character' })
    }
  })

  // Add weapon to character
  fastify.post('/characters/:characterId/weapons', async (request, reply) => {
    try {
      const { characterId } = request.params as { characterId: string }

      // Log the raw request body
      fastify.log.info('Raw request body:', request.body)

      const weaponData = characterWeaponSchema.parse(request.body)

      // Log the parsed data
      fastify.log.info('Parsed weapon data:', weaponData)

      // Verify if character exists
      const character = await models.Character.findByPk(characterId)
      if (!character) {
        return reply.code(404).send({ error: 'Character not found' })
      }

      // Verify if weapon exists
      const weapon = await models.Weapon.findByPk(weaponData.weapon)
      if (!weapon) {
        return reply.code(404).send({ error: 'Weapon not found' })
      }

      // Create character weapon association
      const characterWeapon = await models.CharacterWeapon.create({
        character_id: Number(characterId),
        weapon_id: weaponData.weapon,
        hit: weaponData.hit,
        damage: weaponData.damage,
        element: weaponData.element,
        crit_mod: weaponData.crit_mod,
        crit_from_mod: weaponData.crit_from_mod,
        dex_damage: weaponData.dex_damage,
        price: weaponData.price,
        nickname: weaponData.nickname,
        description: weaponData.description,
      })

      return reply.code(201).send(characterWeapon)
    } catch (error) {
      // Log the detailed error for debugging
      fastify.log.error('Error adding weapon to character:', error)
      if (error instanceof z.ZodError) {
        fastify.log.error(
          'Validation errors:',
          JSON.stringify(error.errors, null, 2)
        )
        return reply.code(400).send({
          error: 'Invalid weapon data',
          details: error.errors,
        })
      }
      return reply
        .code(500)
        .send({ error: 'Failed to add weapon to character' })
    }
  })

  // Remove weapon from character
  fastify.delete(
    '/characters/:characterId/weapons/:weaponId',
    async (request, reply) => {
      try {
        const { characterId, weaponId } = request.params as {
          characterId: string
          weaponId: string
        }

        const result = await models.CharacterWeapon.destroy({
          where: {
            character_id: parseInt(characterId),
            weapon_id: parseInt(weaponId),
          },
        })

        if (result === 0) {
          return reply
            .code(404)
            .send({ error: 'Character weapon association not found' })
        }

        fastify.log.info(
          `Weapon ${weaponId} removed from character ${characterId}`
        )
        return reply.code(204).send()
      } catch (error) {
        fastify.log.error('Error removing weapon from character:', error)
        return reply.code(500).send({
          error: 'Failed to remove weapon from character',
          details: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }
  )
}
