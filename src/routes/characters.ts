import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { QueryTypes } from 'sequelize'
import {
  Character,
  Race,
  Alignment,
  Divinity,
  User,
  Portrait,
  sequelize,
  CharacterWeapon,
  Weapon,
} from '../models/index.js'

// Import utility functions
import getCharXp from '../util/getCharXp.js'

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
      const characters = await Character.findAll({
        include: [
          { model: Race, as: 'race' },
          { model: Alignment, as: 'alignment' },
          { model: Divinity, as: 'divinity' },
          { model: User, as: 'user', attributes: ['id', 'name'] },
          { model: Portrait, as: 'portrait' },
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

      const character = await Character.findByPk(parseInt(id), {
        include: [
          { model: Race, as: 'race' },
          { model: Alignment, as: 'alignment' },
          { model: Divinity, as: 'divinity' },
          { model: User, as: 'user', attributes: ['id', 'name'] },
          { model: Portrait, as: 'portrait' },
        ],
      })

      if (!character) {
        return reply.code(404).send({ error: 'Character not found' })
      }

      return reply.send(character)
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
      const character = await Character.create(charData)
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
      const createdCharacter = await Character.findByPk(character.id, {
        include: [
          { model: Race, as: 'race' },
          { model: Alignment, as: 'alignment' },
          { model: Divinity, as: 'divinity' },
          { model: User, as: 'user', attributes: ['id', 'name'] },
          { model: Portrait, as: 'portrait' },
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

      const character = await Character.findByPk(parseInt(id))

      if (!character) {
        return reply.code(404).send({ error: 'Character not found' })
      }

      await character.update(characterData)

      // Fetch updated character with associations
      const updatedCharacter = await Character.findByPk(character.id, {
        include: [
          { model: Race, as: 'race' },
          { model: Alignment, as: 'alignment' },
          { model: Divinity, as: 'divinity' },
          { model: User, as: 'user', attributes: ['id', 'name'] },
          { model: Portrait, as: 'portrait' },
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

      const character = await Character.findByPk(parseInt(id))

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
      const character = await Character.findByPk(characterId)
      if (!character) {
        return reply.code(404).send({ error: 'Character not found' })
      }

      // Verify if weapon exists
      const weapon = await Weapon.findByPk(weaponData.weapon)
      if (!weapon) {
        return reply.code(404).send({ error: 'Weapon not found' })
      }

      // Create character weapon association
      const characterWeapon = await CharacterWeapon.create({
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

        const result = await CharacterWeapon.destroy({
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
