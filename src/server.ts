import Fastify from 'fastify'
import { config } from 'dotenv'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import websocket from '@fastify/websocket'
import { initWebsocketUtils } from './utils/websocket'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import type { WebSocket } from 'ws'

// Import models to initialize them
import './models/index'
import './schemas/index'

// Import routes
import authRoutes from './routes/auth'
import characterRoutes from './routes/characters'
import combatRoutes from './routes/combat'
import mapRoutes from './routes/maps'
import charTokenRoutes from './routes/chartokens'
import initiativeRoutes from './routes/initiatives'
import tokenRoutes from './routes/tokens'
import portraitRoutes from './routes/portraits'
import monsterRoutes from './routes/monsters'
import uploadRoutes from './routes/uploads'
import armorRoutes from './routes/armor'
import weaponRoutes from './routes/weapon'
import equipmentRoutes from './routes/equipment'
import raceRoutes from './routes/race'
import alignmentRoutes from './routes/alignment'
import divinityRoutes from './routes/divinity'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
config({ path: join(__dirname, '..', '.env') })

// Create Fastify instance
const fastify = Fastify({
  logger:
    process.env.NODE_ENV === 'production'
      ? true
      : {
          transport: {
            target: 'pino-pretty',
          },
        },
})

// WebSocket clients management
const wsClients = new Set<WebSocket>()

// Register plugins
async function registerPlugins() {
  try {
    // CORS
    await fastify.register(cors, {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })

    // JWT
    await fastify.register(jwt, {
      secret: process.env.APP_SECRET || '',
    })

    // Multipart for file uploads
    await fastify.register(multipart, {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    })

    // WebSocket plugin
    await fastify.register(websocket)

    // WebSocket route
    fastify.register(async function (fastify) {
      fastify.get('/ws', { websocket: true }, (connection, req) => {
        wsClients.add(connection)

        fastify.log.info(
          `🔌 WebSocket client connected. Total clients: ${wsClients.size}`
        )

        connection.on('message', (message: Buffer) => {
          try {
            const data = JSON.parse(message.toString())
            fastify.log.info('📨 WebSocket message received:', data)

            // Broadcast message to all connected clients
            wsClients.forEach(client => {
              if (client.readyState === 1) {
                // OPEN
                client.send(JSON.stringify(data))
              }
            })
          } catch (error) {
            fastify.log.error('❌ Error processing WebSocket message:', error)
          }
        })

        connection.on('close', () => {
          wsClients.delete(connection)
          fastify.log.info(
            `🔌 WebSocket client disconnected. Total clients: ${wsClients.size}`
          )
        })

        connection.on('error', (error: Error) => {
          fastify.log.error('❌ WebSocket error:', error)
          wsClients.delete(connection)
        })
      })
    })

    // Add broadcast function to fastify instance
    fastify.decorate('broadcast', (event: string, data: any) => {
      const message = JSON.stringify({ event, data })
      wsClients.forEach(client => {
        if (client.readyState === 1) {
          // OPEN
          client.send(message)
        }
      })
    })
  } catch (error) {
    fastify.log.error('❌ Error registering plugins:', error)
    throw error
  }
}

// Health check routes
async function registerHealthRoutes() {
  fastify.get('/', async () => {
    return {
      message: 'DVinte API - Fastify + TypeScript',
      version: '2.0.0',
    }
  })

  fastify.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    }
  })

  fastify.get('/check', async () => {
    return {
      status: 'running',
      node_version: process.version,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    }
  })
}

// Database connections
async function connectDatabases() {
  try {
    // MongoDB connection (Mongoose)
    fastify.log.info('🔌 Connecting to MongoDB...')
    const mongoose = await import('mongoose')
    const mongoUrl = process.env.MONGO_URL

    if (!mongoUrl) {
      throw new Error('MONGO_URL environment variable is required')
    }

    fastify.log.info(`🔗 MongoDB URL: ${mongoUrl.substring(0, 50)}...`)

    await mongoose.default.connect(mongoUrl)

    // Listen for connection events
    mongoose.default.connection.on('connected', () => {
      fastify.log.info('✅ MongoDB connected successfully')
    })

    mongoose.default.connection.on('error', err => {
      fastify.log.error('❌ MongoDB connection error:', err)
    })

    mongoose.default.connection.on('disconnected', () => {
      fastify.log.warn('⚠️ MongoDB disconnected')
    })

    // PostgreSQL connection (Sequelize)
    fastify.log.info('🔌 Connecting to PostgreSQL...')
    const { default: database } = await import('./database/index')
    await database.authenticate()
    fastify.log.info('✅ PostgreSQL connected successfully')
  } catch (error) {
    fastify.log.error('❌ Database connection failed:', error)
    fastify.log.error(
      'Error details:',
      error instanceof Error ? error.message : String(error)
    )
    throw error
  }
}

// Start server
async function start() {
  try {
    fastify.log.info('🚀 Starting server initialization...')

    fastify.log.info('📦 Registering plugins...')
    await registerPlugins()

    fastify.log.info('🏥 Registering health routes...')
    await registerHealthRoutes()

    fastify.log.info('📋 Registering API routes FIRST...')
    await fastify.register(authRoutes)
    await fastify.register(characterRoutes)
    await fastify.register(combatRoutes)
    await fastify.register(mapRoutes)
    await fastify.register(charTokenRoutes)
    await fastify.register(initiativeRoutes)
    await fastify.register(tokenRoutes)
    await fastify.register(portraitRoutes)
    await fastify.register(monsterRoutes)
    await fastify.register(uploadRoutes)
    await fastify.register(armorRoutes)
    await fastify.register(weaponRoutes)
    await fastify.register(equipmentRoutes)
    await fastify.register(raceRoutes)
    await fastify.register(alignmentRoutes)
    await fastify.register(divinityRoutes)

    fastify.log.info('🔗 Connecting to databases...')
    await connectDatabases()

    const port = Number(process.env.PORT) || 9600
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'

    fastify.log.info(`🌐 Starting server on ${host}:${port}...`)
    await fastify.listen({ port, host })

    fastify.log.info(`🚀 Server running on ${host}:${port}`)
    fastify.log.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
    fastify.log.info(
      `🔌 WebSocket ready for connections on ws://${host}:${port}/ws`
    )
  } catch (error) {
    fastify.log.error('❌ Server startup failed:')
    console.error('Full error:', error)
    if (error instanceof Error) {
      fastify.log.error('Error name:', error.name)
      fastify.log.error('Error message:', error.message)
      fastify.log.error('Stack trace:', error.stack)
    }
    process.exit(1)
  }
}

// Initialize WebSocket utils
initWebsocketUtils(fastify)

// Start the server
start()
