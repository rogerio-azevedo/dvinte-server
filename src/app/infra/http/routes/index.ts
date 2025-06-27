import { FastifyInstance } from 'fastify'

import authRoutes from './auth'
import characterRoutes from './characters'
import combatRoutes from './combat'
import mapRoutes from './maps'
import charTokenRoutes from './chartokens'
import initiativeRoutes from './initiatives'
import tokenRoutes from './tokens'
import portraitRoutes from './portraits'
import uploadRoutes from './uploads'
import armorRoutes from './armor'
import weaponRoutes from './weapon'
import equipmentRoutes from './equipment'
import raceRoutes from './race'
import alignmentRoutes from './alignment'
import divinityRoutes from './divinity'
import monsterRoutes from './monsters'

export default async function routes(fastify: FastifyInstance) {
  await fastify.register(authRoutes)
  await fastify.register(alignmentRoutes)
  await fastify.register(armorRoutes)
  await fastify.register(weaponRoutes)
  await fastify.register(equipmentRoutes)
  await fastify.register(raceRoutes)
  await fastify.register(divinityRoutes)
  await fastify.register(characterRoutes)
  await fastify.register(portraitRoutes)
  await fastify.register(tokenRoutes)
  await fastify.register(charTokenRoutes)
  await fastify.register(mapRoutes)
  await fastify.register(combatRoutes)
  await fastify.register(initiativeRoutes)
  await fastify.register(monsterRoutes)
  await fastify.register(uploadRoutes)
}
