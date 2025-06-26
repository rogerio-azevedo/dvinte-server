import {
  UploadFile,
  FolderType,
} from '../../domain/upload/entities/UploadFile.js'
import {
  IUploadRepository,
  UploadResult,
} from '../../domain/upload/repositories/IUploadRepository.js'
import { generateFileName } from '../../infra/storage/R2.js'

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
      return await this.uploadRepository.uploadFile(
        uploadFile,
        folderType,
        fileName
      )
    } catch (error) {
      console.error('Erro no upload:', error)
      return { success: false, error: 'Erro interno do servidor' }
    }
  }
}
