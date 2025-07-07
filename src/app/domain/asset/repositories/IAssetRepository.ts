import { Asset } from '../entities/Asset'

export interface IAssetRepository {
  create(url: string, originalName: string): Promise<Asset>
  delete(id: number): Promise<void>
  list(): Promise<Asset[]>
}
