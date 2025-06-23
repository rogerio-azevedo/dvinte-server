import GameMap from '../models/GameMap'
import { changeMap } from '../../websocket'

class GameMapController {
  async index(req, res) {
    const map = await GameMap.findAll()

    return res.json(map)
  }

  async show(req, res) {
    const map = await GameMap.findOne({
      where: {
        campaign_id: Number(req.params.id),
      },
    })
    return res.json(map)
  }

  async store(req, res) {
    const mapExists = await GameMap.findOne({
      where: { campaign_id: 1 },
    })

    if (!mapExists) {
      const newMap = {
        campaign_id: 1,
        battle: req.body?.battle,
        world: req.body?.world,
        width: req.body?.width,
        height: req.body?.height,
        grid: req.body.grid || true,
        fog: req.body?.fog || false,
        gm_layer: req.body?.gm_layer || false,
        owner: Number(req.body?.owner) || 1,
      }
      const gameMap = await GameMap.create(newMap)
      return res.json(gameMap)
    } else {
      const editMap = {
        battle: req.body?.battle,
        world: req.body?.world,
        portrait: req.body?.portrait || '',
        orientation: req.body?.orientation,
        width: Number(req.body?.width),
        height: Number(req.body?.height),
        grid: req.body.grid,
        fog: req.body?.fog,
        gm_layer: req.body?.gm_layer,
      }

      try {
        const editedGameMap = await GameMap.update(editMap, {
          where: { campaign_id: 1 },
        })

        changeMap(editMap)

        return res.json(editedGameMap)
      } catch (error) {
        return res
          .status(500)
          .json({ error: 'Houve um problema na edição do mapa.' })
      }
    }
  }
}

export default new GameMapController()
