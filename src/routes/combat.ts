import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { Logs, Initiative } from '../schemas/index.js'
import { saveMessage } from '../utils/websocket.js'
import { Character } from '../models/index.js'

// Mock data for now - will be replaced with real models later
const mockCombatData = {
  id: 1,
  Health: 100,
  HealthNow: 85,
  Fortitude: 5,
  Reflex: 3,
  Will: 4,
  BaseAttack: 8,
  StrMod: 2,
  StrModTemp: null,
  ConMod: 1,
  ConModTemp: null,
  DexMod: 3,
  DexModTemp: null,
  WisMod: 1,
  WisModTemp: null,
  Armor: [
    {
      type: 1, // armor
      bonus: 4,
      defense: 2,
      dexterity: 3,
    },
    {
      type: 2, // shield
      bonus: 2,
      defense: 1,
      dexterity: null,
    },
  ],
  Weapon: [
    {
      id: 1,
      name: 'Espada Longa',
      damage: '1d8',
      hit: 8,
    },
  ],
}

const mockCombatMessages = [
  {
    id: 1,
    message: 'Combate iniciado!',
    user: 'Sistema',
    date: new Date().toISOString(),
    isCrit: false,
  },
]

export default async function combatRoutes(fastify: FastifyInstance) {
  // Get combat data for a specific user
  fastify.get('/combats/:userId', async (request, reply) => {
    try {
      const { userId } = request.params as { userId: string }

      fastify.log.info(`Searching for character with user_id: ${userId}`)

      // Primeiro, buscar apenas o personagem básico para testar
      const char: any = await Character.findOne({
        where: {
          user_id: userId,
          is_ativo: true,
        },
      })

      if (!char) {
        fastify.log.error(`No active character found for user_id: ${userId}`)
        return reply
          .code(404)
          .send({ error: 'No active character found for this user' })
      }

      fastify.log.info(`Found character: ${char.id} - ${char.name}`)

      // Usar as mesmas propriedades do controller original para manter compatibilidade
      const charData = {
        Cod: char.id,
        Name: char.name?.toUpperCase() || '',
        Level: char.level || 0,
        Health: char.health || 0,
        HealthNow: char.health_now || 0,
        Race: '', // TODO: Add race when available
        Age: char.age || 0,
        Gender: '', // TODO: Add gender when available
        Size: '', // TODO: Add size when available

        Height: char.height || '',
        Weight: char.weight || '',
        Eye: char.eye?.toUpperCase() || '',
        Hair: char.hair?.toUpperCase() || '',
        Skin: char.skin?.toUpperCase() || '',

        Exp: char.exp || 0,
        Alig: '', // TODO: Add alignment when available
        Divin: '', // TODO: Add divinity when available

        Str: 10, // TODO: Add attributes when available
        Dex: 10,
        Con: 10,
        Int: 10,
        Wis: 10,
        Cha: 10,

        StrMod: 0, // TODO: Calculate modifiers when attributes available
        DexMod: 0,
        ConMod: 0,
        IntMod: 0,
        WisMod: 0,
        ChaMod: 0,

        StrTemp: 0, // TODO: Add temp attributes when available
        DexTemp: 0,
        ConTemp: 0,
        IntTemp: 0,
        WisTemp: 0,
        ChaTemp: 0,

        StrModTemp: 0, // TODO: Calculate temp modifiers when available
        DexModTemp: 0,
        ConModTemp: 0,
        IntModTemp: 0,
        WisModTemp: 0,
        ChaModTemp: 0,

        Portrait: '', // TODO: Add portrait URL when available

        BaseAttack: 0, // TODO: Calculate from classes when available
        Fortitude: 0, // TODO: Calculate from classes when available
        Reflex: 0, // TODO: Calculate from classes when available
        Will: 0, // TODO: Calculate from classes when available

        Classes: [],
        Armor: [],
        Weapon: [],
        Equipment: [],
      }

      return reply.send(charData)
    } catch (error) {
      fastify.log.error('❌ Error fetching combat data:', error)
      if (error instanceof Error) {
        fastify.log.error('❌ Error message:', error.message)
        fastify.log.error('❌ Error stack:', error.stack)
      } else {
        fastify.log.error('❌ Error details:', String(error))
      }

      // Log the specific SQL error if it exists
      if (error && typeof error === 'object' && 'sql' in error) {
        fastify.log.error('❌ SQL Error:', (error as any).sql)
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
      // Get logs from MongoDB - ordered by createdAt ASC (oldest first, newest last/bottom)
      const logs = await Logs.find().sort({ createdAt: 1 }).limit(50).lean()

      // Transform data to match frontend expectations
      const messages = logs.map((log: any) => ({
        id: log._id,
        message: log.message,
        user: log.user,
        date: log.createdAt || new Date().toISOString(),
        isCrit: log.isCrit === 'true' || log.isCrit === true,
        result: log.result,
        type: log.type,
      }))

      return reply.send(messages)
    } catch (error) {
      fastify.log.error('Error fetching combat logs:', error)
      // Fallback to mock data if MongoDB fails
      return reply.send(mockCombatMessages)
    }
  })

  // Post new combat message
  fastify.post('/combats', async (request, reply) => {
    try {
      fastify.log.info(
        '📝 Creating new chat message from:',
        request.headers.origin || 'unknown'
      )

      // Handle empty body
      if (!request.body || Object.keys(request.body).length === 0) {
        fastify.log.error('❌ Empty request body')
        return reply.code(400).send({ error: 'Request body is empty' })
      }

      const messageSchema = z.object({
        message: z.string().min(1),
        user: z.string().min(1),
        user_id: z.union([z.number(), z.string()]).optional(),
        result: z.union([z.number(), z.string()]).optional(),
        type: z.union([z.number(), z.string()]).optional(),
        isCrit: z.union([z.boolean(), z.string()]).optional(),
      })

      const data = messageSchema.parse(request.body)

      // Save to MongoDB
      const logData = {
        id: Date.now(),
        user_id:
          typeof data.user_id === 'string'
            ? parseInt(data.user_id) || 1
            : data.user_id || 1,
        user: data.user,
        message: data.message,
        result:
          typeof data.result === 'string'
            ? parseInt(data.result) || 0
            : data.result || 0,
        type:
          typeof data.type === 'string'
            ? parseInt(data.type) || 1
            : data.type || 1,
        isCrit:
          data.isCrit === true || data.isCrit === 'true' ? 'true' : 'false',
      }

      const newLog = new Logs(logData)
      const savedLog = await newLog.save()

      fastify.log.info('✅ Message saved:', {
        user: savedLog.user,
        message: savedLog.message,
      })

      // Return in frontend format
      const response = {
        id: savedLog._id,
        message: savedLog.message,
        user: savedLog.user,
        date: savedLog.createdAt,
        isCrit: savedLog.isCrit === 'true',
        result: savedLog.result,
        type: savedLog.type,
      }

      // Broadcast new message via Socket.IO
      saveMessage(response)

      return reply.code(201).send(response)
    } catch (error) {
      fastify.log.error('❌ Error creating combat message:', error)

      // Check if it's a validation error
      if (error instanceof z.ZodError) {
        return reply.code(400).send({
          error: 'Validation failed',
          details: error.errors,
        })
      }

      return reply.code(400).send({
        error: 'Failed to create combat message',
        details: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  })
}
