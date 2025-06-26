import { FastifyInstance } from 'fastify'
import { UploadController } from '../controllers/UploadController.js'
import { R2UploadRepository } from '../../repositories/R2UploadRepository.js'

export default async function uploadsRoutes(fastify: FastifyInstance) {
  const uploadRepository = new R2UploadRepository()
  const uploadController = new UploadController(uploadRepository)

  // Rota para upload direto de arquivo via multipart
  fastify.post('/upload', async (request, reply) => {
    return uploadController.handleUpload(request, reply)
  })

  // Rota para obter URL assinada para upload direto do frontend
  fastify.post<{
    Body: {
      folderType: string
      fileName: string
      contentType: string
      category?: string
    }
  }>('/upload/presigned', async (request, reply) => {
    return uploadController.handlePresignedUrl(request, reply)
  })

  // Rota para deletar arquivo
  fastify.delete<{
    Body: {
      url: string
    }
  }>('/upload', async (request, reply) => {
    return uploadController.handleDelete(request, reply)
  })

  // Rota para listar configurações de upload
  fastify.get('/upload/config', async (request, reply) => {
    return uploadController.handleGetConfigs(request, reply)
  })
}
