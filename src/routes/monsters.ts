import { FastifyInstance } from 'fastify'

// Mock data for now - replace with actual Monster model when available
const mockMonsters = [
  { id: 1, name: 'Goblin', type: 'Humanoid', cr: '1/4' },
  { id: 2, name: 'Orc', type: 'Humanoid', cr: '1' },
  { id: 3, name: 'Dragon', type: 'Dragon', cr: '10' },
]

export default async function monsterRoutes(fastify: FastifyInstance) {
  // Get all monsters (must come before /:id route)
  fastify.get('/monsters', async (request, reply) => {
    try {
      // TODO: Replace with actual Monster model query
      // const monsters = await Monster.findAll({
      //   order: [['name', 'ASC']],
      // })

      return reply.send(mockMonsters)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch monsters' })
    }
  })

  // Get monster by ID
  fastify.get('/monsters/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      // Validate that ID is not empty and is a valid number
      if (!id || id.trim() === '' || isNaN(Number(id))) {
        return reply.code(400).send({ error: 'Invalid monster ID' })
      }

      // TODO: Replace with actual Monster model query
      // const monster = await Monster.findByPk(id)
      const monster = mockMonsters.find(m => m.id === parseInt(id))

      if (!monster) {
        return reply.code(404).send({ error: 'Monster not found' })
      }

      return reply.send(monster)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to fetch monster' })
    }
  })

  // Create new monster
  fastify.post('/monsters', async (request, reply) => {
    try {
      const { name, type, cr } = request.body as {
        name: string
        type: string
        cr: string
      }

      // TODO: Replace with actual Monster model creation
      // const monster = await Monster.create({ name, type, cr })

      const newMonster = {
        id: mockMonsters.length + 1,
        name,
        type,
        cr,
      }

      mockMonsters.push(newMonster)

      fastify.log.info(`Monster created: ${name}`)
      return reply.code(201).send(newMonster)
    } catch (error) {
      fastify.log.error('Error creating monster:', error)
      return reply.code(500).send({ error: 'Failed to create monster' })
    }
  })

  // Update monster
  fastify.put('/monsters/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }
      const { name, type, cr } = request.body as {
        name?: string
        type?: string
        cr?: string
      }

      // Validate that ID is not empty and is a valid number
      if (!id || id.trim() === '' || isNaN(Number(id))) {
        return reply.code(400).send({ error: 'Invalid monster ID' })
      }

      // TODO: Replace with actual Monster model update
      // const monster = await Monster.findByPk(id)
      // if (!monster) {
      //   return reply.code(404).send({ error: 'Monster not found' })
      // }
      // await monster.update({ name, type, cr })

      const monsterIndex = mockMonsters.findIndex(m => m.id === parseInt(id))
      if (monsterIndex === -1) {
        return reply.code(404).send({ error: 'Monster not found' })
      }

      if (name) mockMonsters[monsterIndex].name = name
      if (type) mockMonsters[monsterIndex].type = type
      if (cr) mockMonsters[monsterIndex].cr = cr

      fastify.log.info(`Monster updated: ${id}`)
      return reply.send(mockMonsters[monsterIndex])
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to update monster' })
    }
  })

  // Delete monster
  fastify.delete('/monsters/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string }

      // Validate that ID is not empty and is a valid number
      if (!id || id.trim() === '' || isNaN(Number(id))) {
        return reply.code(400).send({ error: 'Invalid monster ID' })
      }

      // TODO: Replace with actual Monster model deletion
      // const monster = await Monster.findByPk(id)
      // if (!monster) {
      //   return reply.code(404).send({ error: 'Monster not found' })
      // }
      // await monster.destroy()

      const monsterIndex = mockMonsters.findIndex(m => m.id === parseInt(id))
      if (monsterIndex === -1) {
        return reply.code(404).send({ error: 'Monster not found' })
      }

      const deletedMonster = mockMonsters.splice(monsterIndex, 1)[0]

      fastify.log.info(`Monster deleted: ${deletedMonster.name}`)
      return reply.send({ message: 'Monster deleted successfully' })
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({ error: 'Failed to delete monster' })
    }
  })
}
