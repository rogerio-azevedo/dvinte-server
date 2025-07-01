import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import models from '../../db/models'

const classSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  attack: z.string().optional(),
  fortitude: z.string().optional(),
  reflex: z.string().optional(),
  will: z.string().optional(),
})

export default async function classRoutes(fastify: FastifyInstance) {
  // Listar todas as classes
  fastify.get('/classes', async (_request, reply) => {
    try {
      const classes = await models.Class.findAll({
        order: [['name', 'ASC']],
      })
      return reply.send(classes)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Erro ao buscar classes' })
    }
  })

  // Buscar classe por ID
  fastify.get('/classes/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const classe = await models.Class.findByPk(id)
      if (!classe) {
        return reply.code(404).send({ error: 'Classe não encontrada' })
      }
      return reply.send(classe)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Erro ao buscar classe' })
    }
  })

  // Criar nova classe
  fastify.post('/classes', async (request, reply) => {
    try {
      const data = classSchema.parse(request.body)
      const classe = await models.Class.create(data)
      return reply.code(201).send(classe)
    } catch (error) {
      fastify.log.error(error)
      if (error instanceof z.ZodError) {
        return reply
          .code(400)
          .send({ error: 'Dados inválidos', details: error.errors })
      }
      return reply.code(500).send({ error: 'Erro ao criar classe' })
    }
  })
}
