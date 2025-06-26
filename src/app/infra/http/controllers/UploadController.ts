import { FastifyRequest, FastifyReply } from 'fastify'
import { UploadFileUseCase } from '../../../use-cases/upload/UploadFileUseCase.js'
import { FolderType } from '../../../domain/upload/entities/UploadFile.js'
import { IUploadRepository } from '../../../domain/upload/repositories/IUploadRepository.js'

export class UploadController {
  constructor(private uploadRepository: IUploadRepository) {}

  private getUploadUseCase(): UploadFileUseCase {
    return new UploadFileUseCase(this.uploadRepository)
  }

  async handleUpload(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = await request.file()
      const folderType =
        ((request.query as any)?.folderType as FolderType) || 'GENERAL'
      const category = (request.query as any)?.category as string

      if (!data) {
        return reply.code(400).send({ error: 'Nenhum arquivo enviado' })
      }

      // Ler o arquivo em buffer
      const chunks: Buffer[] = []
      for await (const chunk of data.file) {
        chunks.push(chunk)
      }
      const buffer = Buffer.concat(chunks)

      const useCase = this.getUploadUseCase()
      const result = await useCase.execute(
        buffer,
        data.filename,
        data.mimetype,
        buffer.length,
        folderType,
        category
      )

      if (!result.success) {
        return reply.code(400).send({ error: result.error })
      }

      reply.send(result)
    } catch (error) {
      console.error('Erro no upload:', error)
      reply.code(500).send({ error: 'Erro interno do servidor' })
    }
  }

  async handlePresignedUrl(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { folderType, fileName, contentType, category } = request.body as {
        folderType: FolderType
        fileName: string
        contentType: string
        category?: string
      }

      const result = await this.uploadRepository.generatePresignedUrl(
        folderType,
        fileName,
        contentType
      )

      if (!result.success) {
        return reply.code(400).send({ error: result.error })
      }

      reply.send(result)
    } catch (error) {
      console.error('Erro ao gerar URL assinada:', error)
      reply.code(500).send({ error: 'Erro interno do servidor' })
    }
  }

  async handleDelete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { url } = request.body as { url: string }
      const result = await this.uploadRepository.deleteFile(url)

      if (!result.success) {
        return reply.code(400).send({ error: result.error })
      }

      reply.send(result)
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error)
      reply.code(500).send({ error: 'Erro interno do servidor' })
    }
  }

  handleGetConfigs(request: FastifyRequest, reply: FastifyReply) {
    reply.send(this.uploadRepository.getUploadConfigs())
  }
}
