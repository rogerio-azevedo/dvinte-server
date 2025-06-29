import { FastifyInstance } from 'fastify'
import NotesController from '../controllers/NotesController'
import authMiddleware from '../middlewares/auth'

export default async function notesRoutes(fastify: FastifyInstance) {
  // Adiciona o middleware de autenticação para todas as rotas
  fastify.addHook('preHandler', authMiddleware)

  // Rota para listar notas
  fastify.get('/notes', NotesController.index)

  // Rota para criar nota
  fastify.post('/notes', NotesController.store)
}
