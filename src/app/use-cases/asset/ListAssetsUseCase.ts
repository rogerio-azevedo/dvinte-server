import { IAssetRepository } from '../../domain/asset/repositories/IAssetRepository'
import { Asset } from '../../domain/asset/entities/Asset'

export class ListAssetsUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute(): Promise<Asset[]> {
    return this.assetRepository.list()
  }
}
