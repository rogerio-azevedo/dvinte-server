import { FastifyInstance } from 'fastify'
import CharacterEquipmentController from '../controllers/CharacterEquipmentController'
import authMiddleware from '../middlewares/auth'

export default async function characterEquipmentRoutes(
  fastify: FastifyInstance
) {
  // Adiciona o middleware de autenticação para todas as rotas
  fastify.addHook('preHandler', authMiddleware)

  // Rota para criar equipamento do personagem (mantendo o formato antigo)
  fastify.post('/characters/:id/equipments', CharacterEquipmentController.store)

  // Rota para deletar equipamento do personagem
  fastify.delete(
    '/characterequipments/:id',
    CharacterEquipmentController.destroy
  )
}
