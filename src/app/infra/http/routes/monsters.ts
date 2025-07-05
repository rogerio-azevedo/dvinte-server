import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import models from '../../db/models'
import { getMonsterType } from '../../../shared/utils/getMonsterType'
import { getMonsterSubType } from '../../../shared/utils/getMonsterSubType'
import { getSize } from '../../../shared/utils/getSize'

// Schema para validação de criação de monstro
const monsterSchema = z.object({
  data: z.object({
    name: z.string().min(1),
    health: z.union([z.number(), z.string()]).transform(val => Number(val)),
    initiative: z.union([z.number(), z.string()]).transform(val => Number(val)),
    displacement: z.string(),
    ca: z.union([z.number(), z.string()]).transform(val => Number(val)),
    defense: z.string(),
    grab: z.union([z.number(), z.string()]).transform(val => Number(val)),
    challenge: z.union([z.number(), z.string()]).transform(val => Number(val)),
    attack_special: z.string().optional(),
    special_qualities: z.string().optional(),
    fort: z.union([z.number(), z.string()]).transform(val => Number(val)),
    reflex: z.union([z.number(), z.string()]).transform(val => Number(val)),
    will: z.union([z.number(), z.string()]).transform(val => Number(val)),
    skills: z.string().optional(),
    feats: z.string().optional(),
    notes: z.string().optional(),
    monster_url: z.string().optional(),
    type: z.string(),
    subType: z.string().optional(),
    size: z.string(),
    alignment: z.string(),
    strength: z.union([z.number(), z.string()]).transform(val => Number(val)),
    dexterity: z.union([z.number(), z.string()]).transform(val => Number(val)),
    constitution: z
      .union([z.number(), z.string()])
      .transform(val => Number(val)),
    intelligence: z
      .union([z.number(), z.string()])
      .transform(val => Number(val)),
    wisdom: z.union([z.number(), z.string()]).transform(val => Number(val)),
    charisma: z.union([z.number(), z.string()]).transform(val => Number(val)),
    is_ativo: z.boolean().optional().default(true),
  }),
  attacks: z
    .array(
      z.object({
        name: z.string(),
        dice: z.union([z.number(), z.string()]).transform(val => Number(val)),
        multiplier: z
          .union([z.number(), z.string()])
          .transform(val => Number(val)),
        critical: z
          .union([z.number(), z.string()])
          .transform(val => Number(val)),
        crit_from: z
          .union([z.number(), z.string()])
          .transform(val => Number(val)),
        range: z.union([z.number(), z.string()]).transform(val => Number(val)),
        hit: z.union([z.number(), z.string()]).transform(val => Number(val)),
        damage: z.union([z.number(), z.string()]).transform(val => Number(val)),
      })
    )
    .optional()
    .default([]),
})

// Função para converter valores de string para números baseado nos arrays estáticos
async function convertStringToId(
  value: string,
  type: 'size' | 'type' | 'subtype' | 'alignment'
): Promise<number> {
  switch (type) {
    case 'size':
      const sizeMap: { [key: string]: number } = {
        Minúsculo: 1,
        Diminuto: 2,
        Miúdo: 3,
        Pequeno: 4,
        Médio: 5,
        Grande: 6,
        Enorme: 7,
        Imenso: 8,
        Colossal: 9,
      }
      return sizeMap[value] || 5 // Default: Médio

    case 'type':
      const typeMap: { [key: string]: number } = {
        Aberração: 1,
        Animal: 2,
        Construto: 4,
        Dragão: 5,
        Fada: 8,
        Humanoide: 11,
        Monstruosidade: 10,
        'Morto-vivo': 14,
        Planta: 15,
        Verme: 12,
        Outros: 0,
      }
      return typeMap[value] || 0 // Default: Outros

    case 'subtype':
      const subtypeMap: { [key: string]: number } = {
        Aquático: 3,
        Voador: 4,
        Subterrâneo: 24,
        Metamorfo: 19,
        Outros: 0,
      }
      return subtypeMap[value] || 0 // Default: Outros

    case 'alignment':
      // Buscar o alinhamento real do banco de dados
      try {
        const alignment = await models.Alignment.findOne({
          where: { name: value },
        })
        return alignment ? alignment.id : 7 // Default: ID 7 (Neutro/Neutro) se não encontrar
      } catch (error) {
        return 7 // Default: ID 7 em caso de erro
      }

    default:
      return 0
  }
}

export default async function monsterRoutes(fastify: FastifyInstance) {
  // Get all monsters
  fastify.get('/monsters', async (request, reply) => {
    try {
      const monsters = await models.Monster.findAll({
        include: [
          {
            model: models.Alignment,
            as: 'alignment',
            attributes: ['name'],
          },
        ],
        order: [['name', 'ASC']],
      })

      const formattedMonsters = monsters.map((monster: any) => ({
        id: monster.id,
        name: monster.name,
        health: monster.health,
        health_now: monster.health_now,
        initiative: monster.initiative,
        displacement: monster.displacement,
        ca: monster.ca,
        defense: monster.defense,
        grab: monster.grab,
        challenge: monster.challenge,
        monster_url: monster.monster_url,
        type: getMonsterType(monster.type),
        sub_type: getMonsterSubType(monster.sub_type || 0),
        size: getSize(monster.size),
        alignment: monster.alignment?.name || 'Neutro',
        is_ativo: monster.is_ativo,
      }))

      return reply.send(formattedMonsters)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch monsters' })
    }
  })

  // Get monster by ID
  fastify.get('/monsters/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      if (!id || id.trim() === '' || isNaN(Number(id))) {
        return reply.code(400).send({ error: 'Invalid monster ID' })
      }

      const monster = await models.Monster.findByPk(id, {
        include: [
          {
            model: models.Alignment,
            as: 'alignment',
            attributes: ['name'],
          },
          {
            model: models.MonsterAttribute,
            as: 'monster_attribute',
            attributes: [
              'strength',
              'dexterity',
              'constitution',
              'intelligence',
              'wisdom',
              'charisma',
            ],
          },
          {
            model: models.MonsterAttack,
            as: 'monster_attacks',
            attributes: [
              'name',
              'dice',
              'multiplier',
              'critical',
              'crit_from',
              'range',
              'hit',
              'damage',
            ],
          },
        ],
      })

      if (!monster) {
        return reply.code(404).send({ error: 'Monster not found' })
      }

      const formattedMonster = {
        id: monster.id,
        name: monster.name,
        health: monster.health,
        health_now: monster.health_now,
        initiative: monster.initiative,
        displacement: monster.displacement,
        ca: monster.ca,
        defense: monster.defense,
        grab: monster.grab,
        challenge: monster.challenge,
        attack_special: monster.attack_special,
        special_qualities: monster.special_qualities,
        fort: monster.fort,
        reflex: monster.reflex,
        will: monster.will,
        skills: monster.skills,
        feats: monster.feats,
        notes: monster.notes,
        monster_url: monster.monster_url,
        type: getMonsterType(monster.type),
        sub_type: getMonsterSubType(monster.sub_type || 0),
        size: getSize(monster.size),
        alignment: monster.alignment?.name || 'Neutro',
        is_ativo: monster.is_ativo,
        str: monster.monster_attribute?.strength || 10,
        dex: monster.monster_attribute?.dexterity || 10,
        con: monster.monster_attribute?.constitution || 10,
        int: monster.monster_attribute?.intelligence || 10,
        wis: monster.monster_attribute?.wisdom || 10,
        cha: monster.monster_attribute?.charisma || 10,
        attacks: monster.monster_attacks || [],
      }

      return reply.send(formattedMonster)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch monster' })
    }
  })

  // Create new monster
  fastify.post('/monsters', async (request, reply) => {
    try {
      fastify.log.info(
        'Raw request body:',
        JSON.stringify(request.body, null, 2)
      )

      const { data, attacks } = monsterSchema.parse(request.body)

      fastify.log.info(
        'Parsed data:',
        JSON.stringify({ data, attacks }, null, 2)
      )

      // Converter strings para IDs numéricos
      const typeId = await convertStringToId(data.type, 'type')
      const subtypeId = data.subType
        ? await convertStringToId(data.subType, 'subtype')
        : null
      const sizeId = await convertStringToId(data.size, 'size')
      const alignmentId = await convertStringToId(data.alignment, 'alignment')

      fastify.log.info('Converted IDs:', {
        typeId,
        subtypeId,
        sizeId,
        alignmentId,
      })

      const newMonster = {
        name: data.name,
        health: data.health,
        health_now: data.health,
        initiative: data.initiative,
        displacement: data.displacement,
        ca: data.ca,
        defense: data.defense,
        grab: data.grab,
        challenge: data.challenge,
        attack_special: data.attack_special || null,
        special_qualities: data.special_qualities || null,
        fort: data.fort,
        reflex: data.reflex,
        will: data.will,
        skills: data.skills || null,
        feats: data.feats || null,
        notes: data.notes || null,
        monster_url: data.monster_url || null,
        type: typeId,
        sub_type: subtypeId,
        size: sizeId,
        alignment_id: alignmentId,
        is_ativo: data.is_ativo,
      }

      fastify.log.info(
        'Monster data to create:',
        JSON.stringify(newMonster, null, 2)
      )

      const createdMonster = await models.Monster.create(newMonster)

      fastify.log.info(`Monster created with ID: ${createdMonster.id}`)

      // Criar atributos do monstro
      const monsterAttributes = {
        monster_id: createdMonster.id,
        strength: data.strength,
        dexterity: data.dexterity,
        constitution: data.constitution,
        intelligence: data.intelligence,
        wisdom: data.wisdom,
        charisma: data.charisma,
      }

      fastify.log.info(
        'Monster attributes to create:',
        JSON.stringify(monsterAttributes, null, 2)
      )

      // Verificar se existe modelo MonsterAttribute
      if (models.MonsterAttribute) {
        await models.MonsterAttribute.create(monsterAttributes)
        fastify.log.info('Monster attributes created')
      } else {
        fastify.log.warn('MonsterAttribute model not found')
      }

      // Criar ataques do monstro se fornecidos
      if (attacks && attacks.length > 0) {
        const monsterAttacks = attacks.map((attack: any) => ({
          monster_id: createdMonster.id,
          name: attack.name,
          dice: attack.dice,
          multiplier: attack.multiplier,
          critical: attack.critical,
          crit_from: attack.crit_from,
          range: attack.range,
          hit: attack.hit,
          damage: attack.damage,
        }))

        fastify.log.info(
          'Monster attacks to create:',
          JSON.stringify(monsterAttacks, null, 2)
        )

        // Verificar se existe modelo MonsterAttack
        if (models.MonsterAttack) {
          await models.MonsterAttack.bulkCreate(monsterAttacks)
          fastify.log.info(`${attacks.length} monster attacks created`)
        } else {
          fastify.log.warn('MonsterAttack model not found')
        }
      }

      fastify.log.info('Monster creation completed successfully')
      return reply.code(201).send(createdMonster)
    } catch (error) {
      fastify.log.error('Error creating monster:', error)

      // Log detalhado do erro
      if (error instanceof Error) {
        fastify.log.error('Error message:', error.message)
        fastify.log.error('Error stack:', error.stack)
      }

      // Se for erro de validação do Zod
      if (error && typeof error === 'object' && 'issues' in error) {
        fastify.log.error('Validation errors:', (error as any).issues)
        return reply.code(400).send({
          error: 'Validation failed',
          details: (error as any).issues,
        })
      }

      return reply.code(400).send({
        error: 'Failed to create monster',
        details: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  })

  // Update monster
  fastify.put('/monsters/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      if (!id || id.trim() === '' || isNaN(Number(id))) {
        return reply.code(400).send({ error: 'Invalid monster ID' })
      }

      const monster = await models.Monster.findByPk(id)
      if (!monster) {
        return reply.code(404).send({ error: 'Monster not found' })
      }

      const { data } = monsterSchema.parse(request.body)

      // Converter strings para IDs numéricos
      const typeId = await convertStringToId(data.type, 'type')
      const subtypeId = data.subType
        ? await convertStringToId(data.subType, 'subtype')
        : null
      const sizeId = await convertStringToId(data.size, 'size')
      const alignmentId = await convertStringToId(data.alignment, 'alignment')

      const updateData = {
        name: data.name,
        health: data.health,
        initiative: data.initiative,
        displacement: data.displacement,
        ca: data.ca,
        defense: data.defense,
        grab: data.grab,
        challenge: data.challenge,
        attack_special: data.attack_special || null,
        special_qualities: data.special_qualities || null,
        fort: data.fort,
        reflex: data.reflex,
        will: data.will,
        skills: data.skills || null,
        feats: data.feats || null,
        notes: data.notes || null,
        monster_url: data.monster_url || null,
        type: typeId,
        sub_type: subtypeId,
        size: sizeId,
        alignment_id: alignmentId,
        is_ativo: data.is_ativo,
      }

      await monster.update(updateData)

      fastify.log.info(`Monster updated: ${id}`)
      return reply.send(monster)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to update monster' })
    }
  })

  // Delete monster
  fastify.delete('/monsters/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      if (!id || id.trim() === '' || isNaN(Number(id))) {
        return reply.code(400).send({ error: 'Invalid monster ID' })
      }

      const monster = await models.Monster.findByPk(id)
      if (!monster) {
        return reply.code(404).send({ error: 'Monster not found' })
      }

      await monster.destroy()

      fastify.log.info(`Monster deleted: ${id}`)
      return reply.send({ message: 'Monster deleted successfully' })
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to delete monster' })
    }
  })
}
