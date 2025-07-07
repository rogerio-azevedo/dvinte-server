import { FastifyInstance } from 'fastify'
import { AssetController } from '../controllers/AssetController'

const assetController = new AssetController()

export default async function assetsRoutes(fastify: FastifyInstance) {
  fastify.post('/assets', (request, reply) =>
    assetController.create(request, reply)
  )
  fastify.get('/assets', (request, reply) =>
    assetController.list(request, reply)
  )
  fastify.delete('/assets/:id', (request, reply) =>
    assetController.delete(request, reply)
  )
}
