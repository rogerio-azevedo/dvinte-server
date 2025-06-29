import { FastifyInstance } from 'fastify'
import CharacterArmorController from '../controllers/CharacterArmorController'
import authMiddleware from '../middlewares/auth'

export default async function characterArmorRoutes(fastify: FastifyInstance) {
  // Adiciona o middleware de autenticação para todas as rotas
  fastify.addHook('preHandler', authMiddleware)

  // Rota para criar armadura do personagem
  fastify.post('/characterarmors', CharacterArmorController.store)

  // Rota para deletar armadura do personagem
  fastify.delete('/characterarmors/:id', CharacterArmorController.destroy)
}
