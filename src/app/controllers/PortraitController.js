import sharp from 'sharp'
import fs from 'fs'
import Portrait from '../models/Portrait'

const path = require('path')

class PortraitController {
  async index(req, res) {
    const list = await Portrait.findAll()

    return res.json(list)
  }

  async show(req, res) {
    const portrait = await Portrait.findByPk(req.params.id)
    return res.json(portrait)
  }

  async store(req, res) {
    const {
      originalname: fileName,
      filename: newName,
      destination: folder,
      path: fullPath,
    } = req.file

    await sharp(fullPath)
      .resize(500)
      .jpeg({ quality: 70 })
      .toFile(path.resolve(folder, 'portraits', newName))

    fs.unlinkSync(fullPath)

    const file = await Portrait.create({
      name: fileName,
      path: newName,
    })

    return res.json(file)
  }
}

export default new PortraitController()
