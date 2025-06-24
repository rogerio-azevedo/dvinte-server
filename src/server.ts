import Fastify from 'fastify'
import { config } from 'dotenv'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import staticFiles from '@fastify/static'
import fastifyIO from 'fastify-socket.io'
import { initWebsocketUtils } from './utils/websocket.js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Import models to initialize them
import './models/index.js'
import './schemas/index.js'

// Import routes
import authRoutes from './routes/auth.js'
import characterRoutes from './routes/characters.js'
import gameDataRoutes from './routes/game-data.js'
import combatRoutes from './routes/combat.js'
import mapRoutes from './routes/maps.js'
import charTokenRoutes from './routes/chartokens.js'
import initiativeRoutes from './routes/initiatives.js'
import tokenRoutes from './routes/tokens.js'
import portraitRoutes from './routes/portraits.js'
import monsterRoutes from './routes/monsters.js'
import uploadRoutes from './routes/uploads.js'

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

// Register plugins
async function registerPlugins() {
  try {
    // CORS
    await fastify.register(cors, {
      origin: true,
      credentials: true,
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

    // Static files - Portraits
    await fastify.register(staticFiles, {
      root: join(__dirname, '..', 'tmp', 'uploads', 'portraits'),
      prefix: '/portrait-files/',
    })

    // Static files - Tokens
    await fastify.register(staticFiles, {
      root: join(__dirname, '..', 'tmp', 'uploads', 'tokens'),
      prefix: '/token-files/',
      decorateReply: false,
    })

    // Socket.IO plugin (removido websocket plugin para evitar conflitos)
    await fastify.register(fastifyIO, {
      cors: {
        origin: true,
        credentials: true,
      },
      transports: ['polling', 'websocket'],
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
    const { default: database } = await import('./database/index.js')
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

    fastify.log.info('  - Auth routes...')
    await fastify.register(authRoutes)

    fastify.log.info('  - Character routes...')
    await fastify.register(characterRoutes)

    fastify.log.info('  - Game data routes...')
    await fastify.register(gameDataRoutes)

    fastify.log.info('  - Combat routes...')
    await fastify.register(combatRoutes)

    fastify.log.info('  - Map routes...')
    await fastify.register(mapRoutes)

    fastify.log.info('  - Character token routes...')
    await fastify.register(charTokenRoutes)

    fastify.log.info('  - Initiative routes...')
    await fastify.register(initiativeRoutes)

    fastify.log.info('  - Token routes...')
    await fastify.register(tokenRoutes)

    fastify.log.info('  - Portrait routes...')
    await fastify.register(portraitRoutes)

    fastify.log.info('  - Monster routes...')
    await fastify.register(monsterRoutes)

    fastify.log.info('  - Upload routes (S3)...')
    await fastify.register(uploadRoutes)

    fastify.log.info('🔗 Connecting to databases...')
    await connectDatabases()

    // Socket.IO will handle /socket.io/* routes automatically

    const port = Number(process.env.PORT) || 9600
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'

    fastify.log.info(`🌐 Starting server on ${host}:${port}...`)
    await fastify.listen({ port, host })

    // Socket.IO setup - wait for server to be ready (following documentation pattern)
    fastify.ready().then(() => {
      fastify.log.info('🔌 Setting up Socket.IO connection handlers...')

      // Initialize websocket utilities for controllers
      initWebsocketUtils(fastify)

      // @ts-ignore - fastify.io is added by the plugin
      fastify.io.on('connection', (socket: any) => {
        fastify.log.info(`🔌 Socket.IO client connected: ${socket.id}`)

        // Send current state to new client
        // @ts-ignore
        fastify.io.emit('CONNECTED_USERS', [])
        // @ts-ignore
        fastify.io.emit('PREVIOUS_MESSAGES', [])

        // Handle user connection
        socket.on('USER_CONNECTED', (user: any) => {
          fastify.log.info(`👤 User connected: ${user.name || user.id}`)
          // @ts-ignore
          fastify.io.emit('USER_CONNECTED', user)
        })

        // Handle user disconnection
        socket.on('USER_DISCONNECTED', (user: any) => {
          fastify.log.info(`👤 User disconnected: ${user.name || user.id}`)
          // @ts-ignore
          fastify.io.emit('USER_DISCONNECTED', user)
        })

        // Handle chat messages
        socket.on('chat.message', (messageData: any) => {
          fastify.log.info(
            `💬 Chat message from ${messageData.user}: ${messageData.message}`
          )
          // @ts-ignore
          fastify.io.emit('chat.message', messageData)
        })

        // Handle initiative messages
        socket.on('init.message', (messageData: any) => {
          fastify.log.info(
            `🎲 Initiative from ${messageData.user}: ${messageData.initiative}`
          )
          // @ts-ignore
          fastify.io.emit('init.message', messageData)
        })

        // Handle token updates
        socket.on('token.message', (messageData: any) => {
          fastify.log.info(`🎮 Token update received`)
          // @ts-ignore
          fastify.io.emit('token.message', messageData)
        })

        // Handle map changes
        socket.on('map.message', (messageData: any) => {
          fastify.log.info(`🗺️ Map change received`)
          // @ts-ignore
          fastify.io.emit('map.message', messageData)
        })

        // Handle line drawing
        socket.on('line.message', (messageData: any) => {
          fastify.log.info(`✏️ Line drawing received`)
          // @ts-ignore
          fastify.io.emit('line.message', messageData)
        })

        // Handle notes
        socket.on('note.message', (messageData: any) => {
          fastify.log.info(`📝 Note from ${messageData.user}`)
          // @ts-ignore
          fastify.io.emit('note.message', messageData)
        })

        socket.on('disconnect', () => {
          fastify.log.info(`🔌 Socket.IO client disconnected: ${socket.id}`)
        })
      })

      fastify.log.info('✅ Socket.IO handlers configured')
    })

    fastify.log.info(`🚀 Server running on ${host}:${port}`)
    fastify.log.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
    fastify.log.info(`🔌 Socket.IO ready for connections`)
    fastify.log.info('✅ Server startup completed successfully!')
  } catch (error) {
    fastify.log.error('❌ Server startup failed:', error)

    // Log stack trace for better debugging
    if (error instanceof Error) {
      fastify.log.error('Stack trace:', error.stack)
    }

    // Try to close fastify gracefully
    try {
      await fastify.close()
    } catch (closeError) {
      fastify.log.error('Error closing fastify:', closeError)
    }

    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  fastify.log.info('🛑 SIGTERM received, shutting down gracefully')
  await fastify.close()
  process.exit(0)
})

process.on('SIGINT', async () => {
  fastify.log.info('🛑 SIGINT received, shutting down gracefully')
  await fastify.close()
  process.exit(0)
})

// Start the server
start()
