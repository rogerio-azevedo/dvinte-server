import {
  uploadToR2,
  deleteFromR2,
  getPresignedUploadUrl,
  extractFileNameFromR2Url,
  getFolderTypeFromUrl,
  UPLOAD_CONFIGS,
} from '../storage/R2.js'
import {
  UploadFile,
  FolderType,
} from '../../domain/upload/entities/UploadFile.js'
import {
  IUploadRepository,
  UploadResult,
  PresignedUrlResult,
  DeleteResult,
} from '../../domain/upload/repositories/IUploadRepository.js'
import { AssetRepository } from './AssetRepository'

export class R2UploadRepository implements IUploadRepository {
  async uploadFile(
    file: UploadFile,
    folderType: FolderType,
    fileName: string
  ): Promise<UploadResult> {
    try {
      const url = await uploadToR2(
        folderType,
        file.getBuffer(),
        fileName,
        file.getMimeType(),
        file.getMetadata()
      )

      return {
        success: true,
        url,
        fileName,
        folderType,
        size: file.getSize(),
        originalName: file.getOriginalName(),
      }
    } catch (error) {
      console.error('Erro no upload para R2:', error)
      return { success: false, error: 'Erro ao fazer upload do arquivo' }
    }
  }

  async generatePresignedUrl(
    folderType: FolderType,
    fileName: string,
    contentType: string
  ): Promise<PresignedUrlResult> {
    try {
      const presignedUrl = await getPresignedUploadUrl(
        folderType,
        fileName,
        contentType
      )

      return {
        success: true,
        presignedUrl,
        fileName,
        folderType,
        maxSize: UPLOAD_CONFIGS[folderType].maxSize,
      }
    } catch (error) {
      console.error('Erro ao gerar URL assinada:', error)
      return { success: false, error: 'Erro ao gerar URL para upload' }
    }
  }

  async deleteFile(url: string): Promise<DeleteResult> {
    try {
      const fileName = extractFileNameFromR2Url(url)
      const folderType = getFolderTypeFromUrl(url)

      if (!fileName || !folderType) {
        return { success: false, error: 'URL inválida' }
      }

      await deleteFromR2(folderType, fileName)

      if (folderType === 'GENERAL') {
        const assetRepo = new AssetRepository()
        await assetRepo.deleteByUrl(url)
      }

      return {
        success: true,
        message: 'Arquivo deletado com sucesso',
      }
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error)
      return { success: false, error: 'Erro ao deletar arquivo' }
    }
  }

  getUploadConfigs() {
    return {
      folders: Object.keys(UPLOAD_CONFIGS),
      configs: UPLOAD_CONFIGS,
    }
  }
}
