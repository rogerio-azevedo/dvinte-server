import { FastifyRequest, FastifyReply } from 'fastify'
import { CreateAssetUseCase } from '../../../use-cases/asset/CreateAssetUseCase'
import { DeleteAssetUseCase } from '../../../use-cases/asset/DeleteAssetUseCase'
import { ListAssetsUseCase } from '../../../use-cases/asset/ListAssetsUseCase'
import { AssetRepository } from '../../repositories/AssetRepository'

const assetRepository = new AssetRepository()

export class AssetController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { url, originalName } = request.body as {
        url: string
        originalName: string
      }
      if (!url || !originalName) {
        return reply
          .code(400)
          .send({ error: 'url e originalName são obrigatórios' })
      }
      const useCase = new CreateAssetUseCase(assetRepository)
      const asset = await useCase.execute(url, originalName)
      reply.code(201).send(asset)
    } catch (error) {
      reply.code(500).send({ error: 'Erro ao criar asset' })
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const useCase = new ListAssetsUseCase(assetRepository)
      const assets = await useCase.execute()
      reply.send(assets)
    } catch (error) {
      reply.code(500).send({ error: 'Erro ao listar assets' })
    }
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string }
      const useCase = new DeleteAssetUseCase(assetRepository)
      await useCase.execute(Number(id))
      reply.code(204).send()
    } catch (error) {
      reply.code(500).send({ error: 'Erro ao deletar asset' })
    }
  }
}
