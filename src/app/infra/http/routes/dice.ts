import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import authMiddleware from '../middlewares/auth'
import { saveMessage } from '../../../shared/utils/websocket'
import models from '../../db/models'

// Schema de validação para o request de dado
const diceRollSchema = z.object({
  diceType: z.enum(['d4', 'd6', 'd8', 'd10', 'd12', 'd20']),
  diceMult: z.number().min(1).max(10), // Máximo 10 dados por vez
  diceSides: z.number().min(4).max(20),
  characterId: z.number().optional(), // Para auditoria
})

// Interface do request
interface DiceRollRequest extends FastifyRequest {
  body: {
    diceType: string
    diceMult: number
    diceSides: number
    characterId?: number
  }
  userId?: number
}

interface RandomOrgResponse {
  jsonrpc: string
  result: {
    random: {
      data: number[]
    }
  }
  id: number
}

// Função para gerar aleatoriedade real usando Random.org
async function generateTrueRandomNumbers(
  min: number,
  max: number,
  count: number
): Promise<number[]> {
  try {
    const RANDOM_ORG_API_KEY = process.env.RANDOM_ORG_API_KEY
    const RANDOM_ORG_URL = 'https://api.random.org/json-rpc/4/invoke'

    if (!RANDOM_ORG_API_KEY) {
      console.warn('❌ RANDOM_ORG_API_KEY não encontrada no .env do servidor')
      throw new Error('Random.org API key not found')
    }

    const response = await fetch(RANDOM_ORG_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'generateIntegers',
        params: {
          apiKey: RANDOM_ORG_API_KEY,
          n: count,
          min,
          max,
          replacement: true,
        },
        id: Date.now(),
      }),
    })

    if (!response.ok) {
      console.error(
        '❌ Erro na resposta da Random.org:',
        response.status,
        response.statusText
      )
      throw new Error('Failed to fetch from Random.org')
    }

    const data = (await response.json()) as RandomOrgResponse
    const randomNumbers = data.result.random.data
    console.log(`✅ ${count} números gerados via Random.org:`, randomNumbers)
    return randomNumbers
  } catch (error) {
    console.warn('⚠️ Fallback: usando Math.random devido a erro:', error)
    const results: number[] = []
    for (let i = 0; i < count; i++) {
      const randomValue = Math.floor(Math.random() * (max - min + 1)) + min
      results.push(randomValue)
    }
    console.log('🎲 Números gerados via fallback:', results)
    return results
  }
}

export default async function diceRoutes(fastify: FastifyInstance) {
  // Adiciona middleware de autenticação para todas as rotas
  fastify.addHook('preHandler', authMiddleware)

  // Rota para rolar dados
  fastify.post<{ Body: typeof diceRollSchema._type }>(
    '/dice/roll',
    async (request: DiceRollRequest, reply: FastifyReply) => {
      try {
        // Validar dados de entrada
        const { diceType, diceMult, diceSides, characterId } =
          diceRollSchema.parse(request.body)

        // Obter informações do usuário autenticado
        const userId = request.userId
        if (!userId) {
          return reply.code(401).send({ error: 'Usuário não autenticado' })
        }

        // Buscar dados do usuário (para nome)
        const user = await models.User.findByPk(userId)

        if (!user) {
          return reply.code(404).send({ error: 'Usuário não encontrado' })
        }

        const userName = user.name

        fastify.log.info(
          `🎲 ${userName} (ID: ${userId}) está rolando ${diceMult}${diceType}`
        )

        // Gerar dados com aleatoriedade real
        const diceResults = await generateTrueRandomNumbers(
          1,
          diceSides,
          diceMult
        )

        // Dados para resposta e broadcast
        const diceData = {
          user: userName,
          userId: userId,
          diceType,
          diceSides,
          diceMult,
          diceResult: diceResults,
          timestamp: new Date().toISOString(),
          characterId,
        }

        // Log para auditoria
        fastify.log.info(
          `🎲 Resultado: ${userName} rolou ${diceMult}${diceType}: [${diceResults.join(
            ', '
          )}]`
        )

        // Salvar no log de combate (opcional - para histórico)
        try {
          const resultSum = diceResults.reduce((sum, val) => sum + val, 0)
          const logMessage = `ROLOU ${diceMult}${diceType}: [${diceResults.join(
            ', '
          )}] = ${resultSum}`

          // Aqui você pode salvar no MongoDB se quiser histórico
          // await Logs.create({
          //   user_id: userId,
          //   user: userName,
          //   message: logMessage,
          //   result: resultSum,
          //   type: 9, // Novo tipo para dados
          // })
        } catch (logError) {
          fastify.log.warn('Falha ao salvar log do dado:', logError)
        }

        // Broadcast via WebSocket para todos os jogadores conectados
        saveMessage({
          event: 'dice.roll',
          data: diceData,
        })

        fastify.log.info('📡 Evento dice.roll enviado via WebSocket')

        // Retornar resultado para o cliente
        return reply.code(200).send({
          success: true,
          data: diceData,
        })
      } catch (error) {
        fastify.log.error('Erro ao rolar dados:', error)

        if (error instanceof z.ZodError) {
          return reply.code(400).send({
            error: 'Dados inválidos',
            details: error.errors,
          })
        }

        return reply.code(500).send({
          error: 'Erro interno do servidor',
          details: error instanceof Error ? error.message : String(error),
        })
      }
    }
  )

  // Rota para obter histórico de dados (opcional)
  fastify.get(
    '/dice/history',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.userId
        if (!userId) {
          return reply.code(401).send({ error: 'Usuário não autenticado' })
        }

        // Aqui você pode implementar busca no histórico se salvar os dados
        // Por enquanto, retorna array vazio
        return reply.send([])
      } catch (error) {
        fastify.log.error('Erro ao buscar histórico de dados:', error)
        return reply.code(500).send({ error: 'Erro ao buscar histórico' })
      }
    }
  )

  // Rota para validar permissões de dado (opcional)
  fastify.get(
    '/dice/permissions',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.userId
        if (!userId) {
          return reply.code(401).send({ error: 'Usuário não autenticado' })
        }

        // Aqui você pode implementar lógica de permissões
        // Ex: apenas GMs podem rolar certos tipos de dados, rate limiting, etc.
        return reply.send({
          canRoll: true,
          maxDicePerRoll: 10,
          allowedDiceTypes: ['d4', 'd6', 'd8', 'd10', 'd12', 'd20'],
          cooldownSeconds: 0, // Sem cooldown por enquanto
        })
      } catch (error) {
        fastify.log.error('Erro ao verificar permissões:', error)
        return reply.code(500).send({ error: 'Erro ao verificar permissões' })
      }
    }
  )
}
