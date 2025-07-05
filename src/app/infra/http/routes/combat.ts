import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { Logs, Initiative } from '../../db/schemas/index'
import { saveMessage } from '../../../shared/utils/websocket'
import models from '../../db/models'
import { PipelineStage } from 'mongoose'

import { getSize } from '../../../shared/utils/getSize'
import { getGender } from '../../../shared/utils/getGender'
import { getModifier } from '../../../shared/utils/getModifier'
import { format, subDays, addDays, parseISO } from 'date-fns'

const combatSchema = z.object({
  id: z.number().optional(),
  user_id: z.number(),
  user: z.string(),
  message: z.string(),
  result: z.number(),
  type: z.number(),
  isCrit: z.string().optional(),
})

const healthNowSchema = z.object({
  newHealth: z.number(),
})

export default async function combatRoutes(fastify: FastifyInstance) {
  // Get character data for combat (alias for backward compatibility)
  fastify.get('/combats/characters/:userId', async (request, reply) => {
    // Redirect to the main combat endpoint
    const { userId } = request.params as { userId: string }
    return fastify.inject({
      method: 'GET',
      url: `/combats/${userId}`,
    })
  })

  // Get combat data for a specific user
  fastify.get('/combats/:userId', async (request, reply) => {
    try {
      const { userId } = request.params as { userId: string }

      if (!models || !models.Character) {
        fastify.log.error('Models not properly initialized')
        throw new Error('Models not properly initialized')
      }

      const char = await models.Character.findOne({
        where: {
          user_id: userId,
          is_ativo: true,
        },
        include: [
          {
            model: models.Portrait,
            as: 'portrait',
            attributes: ['id', 'path', 'url'],
          },
          {
            model: models.Divinity,
            as: 'divinity',
            attributes: ['name'],
          },
          {
            model: models.Alignment,
            as: 'alignment',
            attributes: ['name'],
          },
          {
            model: models.Race,
            as: 'race',
            attributes: ['name'],
          },
          {
            model: models.Attribute,
            as: 'attribute',
          },
          {
            model: models.AttributeTemp,
            as: 'attribute_temp',
          },
          {
            model: models.User,
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
            through: { attributes: ['description'] },
          },
        ],
      })

      if (!char) {
        fastify.log.error(`No active character found for user_id: ${userId}`)
        return reply
          .code(404)
          .send({ error: 'No active character found for this user' })
      }

      fastify.log.info('Character found:', {
        id: char.id,
        name: char.name,
        user_id: char.user_id,
      })

      fastify.log.info('Character classes:', char.classes)

      const levels =
        char.classes?.map((l: any) => l.CharacterClass?.level) || []

      fastify.log.info('Character levels:', levels)

      const baseAtack = await models.BaseAttack.findAll({
        where: { level: levels },
        raw: true,
        attributes: ['level', 'low', 'medium', 'high'],
      })

      fastify.log.info('Base attack found:', baseAtack)

      const baseResist = await models.BaseResist.findAll({
        where: { level: levels },
        raw: true,
        attributes: ['level', 'low', 'high'],
      })

      fastify.log.info('Base resist found:', baseResist)

      // Usar as mesmas propriedades do controller original para manter compatibilidade
      interface CharData {
        Cod: number
        Name: string
        User: string
        Level: number
        Race: string
        Health: number
        HealthNow: number
        Age: number
        Gender: string
        Size: string
        Height: string
        Weight: string
        Eye: string
        Hair: string
        Skin: string
        Exp: number
        Alig: string
        Divin: string
        Str: number
        Dex: number
        Con: number
        Int: number
        Wis: number
        Cha: number
        StrMod: number
        DexMod: number
        ConMod: number
        IntMod: number
        WisMod: number
        ChaMod: number
        StrTemp: number
        DexTemp: number
        ConTemp: number
        IntTemp: number
        WisTemp: number
        ChaTemp: number
        StrModTemp: number
        DexModTemp: number
        ConModTemp: number
        IntModTemp: number
        WisModTemp: number
        ChaModTemp: number
        Portrait: string
        BaseAttack: number
        Fortitude: number
        Reflex: number
        Will: number
        Classes: Array<{
          name: string
          attack: string
          fortitude: string
          reflex: string
          will: string
          level: number
        }>
        Armor: Array<{
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
          defense: number
          description: string
        }>
        Weapon: Array<{
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
          hit: number
          damage: number
          element: number
          crit_mod: number
          crit_from_mod: number
          dex_damage: boolean
          nickname: string
          description: string
        }>
        Equipment: Array<{
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
          description: string
        }>
      }

      interface CharacterClass {
        name: string
        attack: string
        fortitude: string
        reflex: string
        will: string
        CharacterClass?: {
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

      const charData: CharData = {
        Cod: char?.id || 0,
        Name: char?.name?.toUpperCase() || '',
        User: char?.user?.name?.toUpperCase() || '',
        Level: char?.level || 0,
        Race: char?.race?.name?.toUpperCase() || '',
        Health: char?.health || 0,
        HealthNow: char?.health_now || 0,
        Age: char?.age || 0,
        Gender: getGender(char?.gender || 0),
        Size: getSize(char?.size || 0),

        Height: char?.height || '',
        Weight: char?.weight || '',
        Eye: char?.eye?.toUpperCase() || '',
        Hair: char?.hair?.toUpperCase() || '',
        Skin: char?.skin?.toUpperCase() || '',

        Exp: char?.exp || 0,
        Alig: char.alignment?.name?.toUpperCase() || '',
        Divin: char.divinity?.name?.toUpperCase() || '',

        Str: char.attribute?.strength || 0,
        Dex: char.attribute?.dexterity || 0,
        Con: char.attribute?.constitution || 0,
        Int: char.attribute?.intelligence || 0,
        Wis: char.attribute?.wisdom || 0,
        Cha: char.attribute?.charisma || 0,

        StrMod: getModifier(char.attribute?.strength) || 0,
        DexMod: getModifier(char.attribute?.dexterity) || 0,
        ConMod: getModifier(char.attribute?.constitution) || 0,
        IntMod: getModifier(char.attribute?.intelligence) || 0,
        WisMod: getModifier(char.attribute?.wisdom) || 0,
        ChaMod: getModifier(char.attribute?.charisma) || 0,

        StrTemp: char.attribute_temp?.strength || 0,
        DexTemp: char.attribute_temp?.dexterity || 0,
        ConTemp: char.attribute_temp?.constitution || 0,
        IntTemp: char.attribute_temp?.intelligence || 0,
        WisTemp: char.attribute_temp?.wisdom || 0,
        ChaTemp: char.attribute_temp?.charisma || 0,

        StrModTemp: getModifier(char.attribute_temp?.strength) || 0,
        DexModTemp: getModifier(char.attribute_temp?.dexterity) || 0,
        ConModTemp: getModifier(char.attribute_temp?.constitution) || 0,
        IntModTemp: getModifier(char.attribute_temp?.intelligence) || 0,
        WisModTemp: getModifier(char.attribute_temp?.wisdom) || 0,
        ChaModTemp: getModifier(char.attribute_temp?.charisma) || 0,

        Portrait: char.portrait?.url || '',

        BaseAttack:
          char.classes?.reduce((total: number, c: any) => {
            const base = baseAtack.find(
              (a: any) => a.level === c.CharacterClass?.level
            )
            return total + ((base && base[c.attack]) || 0)
          }, 0) || 0,

        Fortitude:
          char.classes?.reduce((total: number, c: any) => {
            const base = baseResist.find(
              (a: any) => a.level === c.CharacterClass?.level
            )
            return total + ((base && base[c.fortitude]) || 0)
          }, 0) || 0,

        Reflex:
          char.classes?.reduce((total: number, c: any) => {
            const base = baseResist.find(
              (a: any) => a.level === c.CharacterClass?.level
            )
            return total + ((base && base[c.reflex]) || 0)
          }, 0) || 0,

        Will:
          char.classes?.reduce((total: number, c: any) => {
            const base = baseResist.find(
              (a: any) => a.level === c.CharacterClass?.level
            )
            return total + ((base && base[c.will]) || 0)
          }, 0) || 0,

        Classes:
          char.classes?.map((c: CharacterClass) => ({
            name: c.name?.toUpperCase() || '',
            attack: c.attack || '',
            fortitude: c.fortitude,
            reflex: c.reflex,
            will: c.will,
            level: c.CharacterClass?.level || 0,
          })) || [],

        Armor:
          char.armors?.map((c: CharacterArmor) => ({
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
          char.weapons?.map((c: CharacterWeapon) => ({
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
          char.equipments?.map((c: CharacterEquipment) => ({
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
      fastify.log.error('❌ Error fetching combat data:', error)

      // Enhanced error logging
      if (error instanceof Error) {
        fastify.log.error('❌ Error name:', error.name)
        fastify.log.error('❌ Error message:', error.message)
        fastify.log.error('❌ Error stack:', error.stack)
      } else {
        fastify.log.error('❌ Raw error:', error)
        fastify.log.error('❌ Error type:', typeof error)
        fastify.log.error('❌ Error details:', String(error))
      }

      // Log the specific SQL error if it exists
      if (error && typeof error === 'object') {
        if ('sql' in error) {
          fastify.log.error('❌ SQL Error:', (error as any).sql)
        }
        if ('original' in error) {
          fastify.log.error('❌ Original Error:', (error as any).original)
        }
        if ('parent' in error) {
          fastify.log.error('❌ Parent Error:', (error as any).parent)
        }
      }

      return reply.code(500).send({
        error: 'Failed to fetch combat data',
        details: error instanceof Error ? error.message : String(error),
      })
    }
  })

  // Get combat messages/logs
  fastify.get('/combats', async (request, reply) => {
    try {
      const now = new Date()
      const date1 = subDays(now, 1)
      const date2 = addDays(now, 1)

      const data1 = format(date1, "yyyy-MM-dd'T00:00:00")
      const data2 = format(date2, "yyyy-MM-dd'T23:59:59")

      const logs = await Logs.find({
        createdAt: { $gte: data1, $lte: data2 },
      }).sort({ createdAt: 1 })

      const messages = logs.map(log => ({
        id: log.id,
        user: log.user,
        date: log.createdAt,
        message: log.message,
        isCrit: log.isCrit,
      }))

      return reply.send(messages)
    } catch (error) {
      fastify.log.error('Error fetching combat logs:', error)
    }
  })

  // Post new combat message
  fastify.post('/combats', async (request, reply) => {
    try {
      console.log('request.body', request.body)

      // Save to MongoDB - seguindo o padrão do legado
      console.log('Tentando salvar no MongoDB...')
      const savedLog = await Logs.create(request.body)
      console.log('Salvo no MongoDB:', savedLog)

      // Return in frontend format - seguindo o padrão do legado
      const response = {
        id: savedLog._id,
        message: savedLog.message,
        user: savedLog.user,
        date: savedLog.createdAt,
        isCrit: savedLog.isCrit === 'true',
        result: savedLog.result,
        type: savedLog.type,
      }

      console.log('Response formatado:', response)

      // Broadcast new message via Socket.IO
      saveMessage({
        event: 'chat.message',
        data: response,
      })

      return reply.code(201).send(response)
    } catch (error: any) {
      console.error('❌ Erro completo:', error)
      if (error.stack) {
        console.error('❌ Stack trace:', error.stack)
      }

      return reply.code(400).send({
        error: 'Failed to create combat message',
        details: error instanceof Error ? error.message : String(error),
      })
    }
  })

  // PUT /healthnow
  fastify.put('/healthnow', async (request, reply) => {
    try {
      const { newHealth } = healthNowSchema.parse(request.body)
      const { id } = request.query as { id: string }
      if (!id)
        return reply.code(400).send({ error: 'ID do personagem é obrigatório' })
      // Atualiza no banco
      await models.Character.update(
        { health_now: newHealth },
        { where: { id: Number(id) } }
      )
      fastify.log.info(`Vida do personagem ${id} atualizada para ${newHealth}`)
      return reply.code(200).send({ success: true })
    } catch (error) {
      fastify.log.error(error)
      return reply
        .code(400)
        .send({ error: 'Erro ao atualizar vida do personagem' })
    }
  })

  // PUT /monsterhealthnow
  fastify.put('/monsterhealthnow', async (request, reply) => {
    try {
      const { newHealth } = healthNowSchema.parse(request.body)
      const { id } = request.query as { id: string }
      if (!id)
        return reply.code(400).send({ error: 'ID do monstro é obrigatório' })
      // Atualiza no banco
      await models.Monster.update(
        { health_now: newHealth },
        { where: { id: Number(id) } }
      )
      fastify.log.info(`Vida do monstro ${id} atualizada para ${newHealth}`)
      return reply.code(200).send({ success: true })
    } catch (error) {
      fastify.log.error(error)
      return reply
        .code(400)
        .send({ error: 'Erro ao atualizar vida do monstro' })
    }
  })

  // Get damage stats
  fastify.get('/damages', async (request, reply) => {
    try {
      // Busca a última mensagem de início de sessão
      const sessionStart = await Logs.aggregate([
        {
          $match: { type: 0 },
        },
        {
          $project: {
            _id: 0,
            createdAt: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: 1,
        },
      ])

      // Busca a última mensagem de início de combate
      const combatStart = await Logs.aggregate([
        {
          $match: { type: { $in: [8, 10] } },
        },
        {
          $project: {
            _id: 0,
            createdAt: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: 1,
        },
      ])

      const data2 = format(addDays(new Date(), 1), "yyyy-MM-dd'T23:59:59")
      const { type } = request.query as { type?: string }

      // Define o filtro de data baseado no tipo (combat ou session)
      let match: PipelineStage.Match = {
        $match: {
          type: 4,
          createdAt: {
            $gte:
              combatStart.length > 0 ? combatStart[0].createdAt : new Date(),
            $lte: parseISO(data2),
          },
        },
      }

      if (type !== 'combat') {
        match = {
          $match: {
            type: 4,
            createdAt: {
              $gte:
                sessionStart.length > 0
                  ? sessionStart[0].createdAt
                  : new Date(),
              $lte: parseISO(data2),
            },
          },
        }
      }

      // Agrupa os danos por usuário
      const group: PipelineStage.Group = {
        $group: {
          _id: { user: '$user' },
          damage: {
            $sum: '$result',
          },
        },
      }

      // Formata o resultado
      const project: PipelineStage.Project = {
        $project: {
          _id: 0,
          user: '$_id.user',
          damage: '$damage',
        },
      }

      // Executa a agregação
      const pipeline: PipelineStage[] = [match, group, project]
      const damages = await Logs.aggregate(pipeline)

      return reply.send(damages)
    } catch (error) {
      fastify.log.error('Error fetching damage stats:', error)
      return reply.code(500).send({ error: 'Failed to fetch damage stats' })
    }
  })
}
