import { FastifyInstance } from 'fastify'
import CharacterWeaponController from '../controllers/CharacterWeaponController'
import authMiddleware from '../middlewares/auth'

export default async function characterWeaponRoutes(fastify: FastifyInstance) {
  // Adiciona o middleware de autenticação para todas as rotas
  fastify.addHook('preHandler', authMiddleware)

  // Rota para criar arma do personagem
  fastify.post('/characterweapons', CharacterWeaponController.store)

  // Rota para deletar arma do personagem
  fastify.delete('/characterweapons/:id', CharacterWeaponController.destroy)
}
