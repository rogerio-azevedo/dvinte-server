import Campaign from '../models/Campaign'

class CampaignController {
  async index(req, res) {
    const list = await Campaign.findAll({
      order: [['name', 'ASC']],
    })

    return res.json(list)
  }

  async store(req, res) {
    const campaign = await Campaign.create(req.body)

    return res.json(campaign)
  }
}

export default new CampaignController()
