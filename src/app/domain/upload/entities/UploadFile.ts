export type FolderType = 'PORTRAITS' | 'TOKENS' | 'MAPS' | 'GENERAL'

export interface UploadMetadata extends Record<string, string> {
  originalName: string
  uploadedAt: string
  category: string
}

export class UploadFile {
  constructor(
    private readonly buffer: Buffer,
    private readonly originalName: string,
    private readonly mimeType: string,
    private readonly size: number,
    private readonly metadata: UploadMetadata
  ) {}

  getBuffer(): Buffer {
    return this.buffer
  }

  getOriginalName(): string {
    return this.originalName
  }

  getMimeType(): string {
    return this.mimeType
  }

  getSize(): number {
    return this.size
  }

  getMetadata(): UploadMetadata {
    return this.metadata
  }

  isImage(): boolean {
    return this.mimeType.startsWith('image/')
  }

  validateSize(maxSize: number): boolean {
    return this.size <= maxSize
  }

  validateType(allowedTypes: string[]): boolean {
    return allowedTypes.includes(this.mimeType)
  }
}
