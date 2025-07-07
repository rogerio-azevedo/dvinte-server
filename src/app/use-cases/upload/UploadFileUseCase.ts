import {
  UploadFile,
  FolderType,
} from '../../domain/upload/entities/UploadFile.js'
import {
  IUploadRepository,
  UploadResult,
  DeleteResult,
} from '../../domain/upload/repositories/IUploadRepository.js'
import { generateFileName } from '../../infra/storage/R2.js'
import { AssetRepository } from '../../infra/repositories/AssetRepository'
import {
  getFolderTypeFromUrl,
  extractFileNameFromR2Url,
  deleteFromR2,
} from '../../infra/storage/R2.js'

export class UploadFileUseCase {
  constructor(private uploadRepository: IUploadRepository) {}

  async execute(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    size: number,
    folderType: FolderType = 'GENERAL',
    category?: string
  ): Promise<UploadResult> {
    try {
      // Criar entidade de domínio
      const uploadFile = new UploadFile(buffer, originalName, mimeType, size, {
        originalName,
        uploadedAt: new Date().toISOString(),
        category: category || 'general',
      })

      // Obter configurações de upload
      const { configs } = this.uploadRepository.getUploadConfigs()
      const config = configs[folderType]

      // Validações de domínio
      if (!uploadFile.validateSize(config.maxSize)) {
        return {
          success: false,
          error: `Arquivo muito grande. Máximo: ${
            config.maxSize / (2048 * 2048)
          }MB`,
        }
      }

      if (!uploadFile.validateType(config.allowedTypes)) {
        return {
          success: false,
          error: `Tipo de arquivo não permitido. Tipos aceitos: ${config.allowedTypes.join(
            ', '
          )}`,
        }
      }

      // Gerar nome único do arquivo
      const fileName = generateFileName(originalName, category)

      // Executar upload
      const uploadResult = await this.uploadRepository.uploadFile(
        uploadFile,
        folderType,
        fileName
      )

      // Se for pasta GENERAL, registrar asset no banco
      if (
        folderType === 'GENERAL' &&
        uploadResult.success &&
        uploadResult.url
      ) {
        const assetRepo = new AssetRepository()
        const asset = await assetRepo.create(uploadResult.url, originalName)
        return { ...uploadResult, assetId: asset.id }
      }

      return uploadResult
    } catch (error) {
      console.error('Erro no upload:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }

  async deleteFile(url: string): Promise<DeleteResult> {
    try {
      // Determinar o tipo de pasta pela URL
      const folderType = getFolderTypeFromUrl(url)
      // Extrair nome do arquivo
      const fileName = extractFileNameFromR2Url(url)
      if (!folderType || !fileName) {
        return { success: false, error: 'URL inválida' }
      }
      // Deletar do R2
      await deleteFromR2(folderType, fileName)
      // Se for GENERAL, remover do banco
      if (folderType === 'GENERAL') {
        const assetRepo = new AssetRepository()
        await assetRepo.deleteByUrl(url)
      }
      return { success: true, message: 'Arquivo removido com sucesso' }
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error)
      return { success: false, error: 'Erro ao deletar arquivo' }
    }
  }
}
