import { UploadFile, FolderType } from '../entities/UploadFile.js'

export interface UploadResult {
  success: boolean
  url?: string
  fileName?: string
  folderType?: FolderType
  size?: number
  originalName?: string
  error?: string
  assetId?: number
}

export interface PresignedUrlResult {
  success: boolean
  presignedUrl?: string
  fileName?: string
  folderType?: FolderType
  maxSize?: number
  error?: string
}

export interface DeleteResult {
  success: boolean
  message?: string
  error?: string
}

export interface IUploadRepository {
  uploadFile(
    file: UploadFile,
    folderType: FolderType,
    fileName: string
  ): Promise<UploadResult>

  generatePresignedUrl(
    folderType: FolderType,
    fileName: string,
    contentType: string
  ): Promise<PresignedUrlResult>

  deleteFile(url: string): Promise<DeleteResult>

  getUploadConfigs(): {
    folders: string[]
    configs: Record<string, any>
  }
}
