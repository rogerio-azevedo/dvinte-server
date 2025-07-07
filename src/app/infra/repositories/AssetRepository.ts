import models from '../db/models'
import { Asset } from '../../domain/asset/entities/Asset'
import { IAssetRepository } from '../../domain/asset/repositories/IAssetRepository'

export class AssetRepository implements IAssetRepository {
  async create(url: string, originalName: string): Promise<Asset> {
    const created = await models.Asset.create({
      url,
      original_name: originalName,
    })
    return new Asset(
      created.id,
      created.url,
      created.original_name,
      created.uploaded_at
    )
  }

  async delete(id: number): Promise<void> {
    await models.Asset.destroy({ where: { id } })
  }

  async list(): Promise<Asset[]> {
    const assets = await models.Asset.findAll({
      order: [['uploaded_at', 'DESC']],
    })
    return assets.map(
      a => new Asset(a.id, a.url, a.original_name, a.uploaded_at)
    )
  }

  async deleteByUrl(url: string): Promise<void> {
    await models.Asset.destroy({ where: { url } })
  }
}
