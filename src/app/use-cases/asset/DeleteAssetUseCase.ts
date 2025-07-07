import { IAssetRepository } from '../../domain/asset/repositories/IAssetRepository'

export class DeleteAssetUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute(id: number): Promise<void> {
    await this.assetRepository.delete(id)
  }
}
