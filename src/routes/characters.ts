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
}
