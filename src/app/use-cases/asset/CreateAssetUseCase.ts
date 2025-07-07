import { IAssetRepository } from '../../domain/asset/repositories/IAssetRepository'
import { Asset } from '../../domain/asset/entities/Asset'

export class CreateAssetUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute(url: string, originalName: string): Promise<Asset> {
    return this.assetRepository.create(url, originalName)
  }
}
