import CharacterToken from '../models/CharacterToken'
import { updateToken } from '../../websocket'

class CharacterTokenController {
  async index(req, res) {
    const list = await CharacterToken.findAll({
      attributes: [
        'id',
        'character_id',
        'x',
        'y',
        'width',
        'height',
        'rotation',
        'enabled',
      ],
      include: [
        {
          association: 'tokens',
          attributes: ['id', 'path', 'url'],
        },
      ],
    })

    const tokens = list.map(t => ({
      id: t.id,
      character_id: t.character_id,
      x: t.x,
      y: t.y,
      width: t.width,
      height: t.height,
      rotation: t.rotation,
      enabled: t.enabled,
      image: t && t.tokens.url,
    }))

    return res.json(tokens)
  }

  async store(req, res) {
    const chartoken = await CharacterToken.create(req.body)

    return res.json(chartoken)
  }

  async update(req, res) {
    const char = await CharacterToken.findByPk(req.body.id)

    const { x } = req.body
    const { y } = req.body
    const { width } = req.body
    const { height } = req.body
    const { rotation } = req.body
    const { enabled } = req.body

    if (x && y && rotation && width && height) {
      await char.update({
        x: x.toFixed(2),
        y: y.toFixed(2),
        width: width.toFixed(2),
        height: height.toFixed(2),
        rotation: rotation.toFixed(2),
      })
    } else if (x && y && rotation) {
      await char.update({
        x: x.toFixed(2),
        y: y.toFixed(2),
        rotation: rotation.toFixed(2),
      })
    } else if (x && y) {
      await char.update({
        x: x.toFixed(2),
        y: y.toFixed(2),
      })
    } else if (rotation) {
      await char.update({
        rotation: rotation.toFixed(2),
      })
    } else {
      await char.update({
        enabled: enabled,
      })
    }

    const list = await CharacterToken.findAll({
      attributes: [
        'id',
        'character_id',
        'x',
        'y',
        'width',
        'height',
        'rotation',
        'enabled',
      ],
      include: [
        {
          association: 'tokens',
          attributes: ['id', 'path', 'url'],
        },
      ],
    })

    const tokens = list?.map(t => ({
      id: t.id,
      character_id: t.character_id,
      x: t.x,
      y: t.y,
      width: t.width,
      height: t.height,
      rotation: t.rotation,
      enabled: t.enabled,
      image: t?.tokens?.url,
    }))

    updateToken(tokens)

    return res.json(tokens)
  }

  async destroy(req, res) {
    await CharacterToken.destroy({
      where: {
        id: req.params.id,
      },
    })

    return res.status(201).send()
  }
}

export default new CharacterTokenController()
