import jwt from 'jsonwebtoken'
import { FastifyRequest, FastifyReply } from 'fastify'
import authConfig from '../../../shared/config/auth'

interface DecodedToken {
  id: number
  iat: number
  exp: number
}

declare module 'fastify' {
  interface FastifyRequest {
    userId?: number
  }
}

export default async (req: FastifyRequest, reply: FastifyReply) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return reply.status(401).send({ error: 'Token não fornecido!' })
  }

  const [, token] = authHeader.split(' ')

  try {
    if (!authConfig.secret) {
      return reply
        .status(500)
        .send({ error: 'Configuração de autenticação inválida' })
    }

    const decoded = jwt.verify(
      token,
      authConfig.secret
    ) as unknown as DecodedToken
    req.userId = decoded.id
  } catch (err) {
    return reply.status(401).send({ error: 'Token inválido!' })
  }
}
