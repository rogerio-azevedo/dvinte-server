import { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import models from '../../db/models'

const sessionSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  is_gm: z.boolean().optional(),
})

export default async function authRoutes(fastify: FastifyInstance) {
  // Login route
  fastify.post('/sessions', async (request, reply) => {
    try {
      const { email, password } = sessionSchema.parse(request.body)

      fastify.log.info(`Login attempt for email: ${email}`)

      // Find user by email
      const user = await models.User.findOne({
        where: { email },
        attributes: ['id', 'name', 'email', 'password_hash', 'is_gm'],
      })

      if (!user) {
        fastify.log.warn(`User not found: ${email}`)
        return reply.code(401).send({ error: 'User not found' })
      }

      fastify.log.info(
        `User found: ${
          user.name
        }, password_hash exists: ${!!user.password_hash}`
      )

      // Check if password_hash exists
      if (!user.password_hash) {
        fastify.log.error(`User ${email} has no password_hash`)
        return reply.code(401).send({ error: 'Invalid user configuration' })
      }

      // Check password
      const passwordMatch = await bcrypt.compare(password, user.password_hash)

      if (!passwordMatch) {
        fastify.log.warn(`Invalid password for user: ${email}`)
        return reply.code(401).send({ error: 'Invalid password' })
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id },
        process.env.APP_SECRET || 'dvinte-secret-key-2024',
        { expiresIn: '7d' }
      )

      fastify.log.info(`Login successful for user: ${email}`)

      return reply.send({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          is_gm: user.is_gm,
        },
        token,
      })
    } catch (error) {
      fastify.log.error('Login error:', error)
      return reply.code(400).send({ error: 'Invalid credentials' })
    }
  })

  // Register route
  fastify.post('/users', async (request, reply) => {
    try {
      const { name, email, password, is_gm } = userSchema.parse(request.body)

      // Check if user already exists
      const existingUser = await models.User.findOne({ where: { email } })

      if (existingUser) {
        return reply.code(400).send({ error: 'User already exists' })
      }

      // Hash password
      const password_hash = await bcrypt.hash(password, 8)

      // Create user
      const user = await models.User.create({
        name,
        email,
        phone: '', // Campo obrigatório na migration mas pode ser vazio
        password_hash,
        is_ativo: true,
        is_gm: is_gm || false,
      })

      fastify.log.info(`User created successfully: ${email}`)

      return reply.code(201).send({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          is_gm: user.is_gm,
        },
        message: 'User created successfully',
      })
    } catch (error) {
      fastify.log.error('Registration error:', error)
      return reply.code(400).send({ error: 'Registration failed' })
    }
  })

  // Test route
  fastify.get('/test-auth', async (request, reply) => {
    return {
      message: 'Auth routes working!',
      timestamp: new Date().toISOString(),
    }
  })

  // Get all users
  fastify.get('/users', async (request, reply) => {
    try {
      const users = await models.User.findAll({
        attributes: ['id', 'name', 'email', 'is_gm', 'is_ativo'],
        where: { is_ativo: true },
        order: [['name', 'ASC']],
      })

      return reply.send(users)
    } catch (error) {
      fastify.log.error('Error fetching users:', error)
      return reply.code(500).send({ error: 'Failed to fetch users' })
    }
  })

  // Debug route to check user
  fastify.get('/debug/user/:email', async (request, reply) => {
    try {
      const { email } = request.params as { email: string }
      const user = await models.User.findOne({
        where: { email },
        attributes: [
          'id',
          'name',
          'email',
          'password_hash',
          'is_gm',
          'created_at',
        ],
      })

      if (!user) {
        return reply.code(404).send({ error: 'User not found' })
      }

      return reply.send({
        id: user.id,
        name: user.name,
        email: user.email,
        has_password_hash: !!user.password_hash,
        password_hash_length: user.password_hash?.length || 0,
        is_gm: user.is_gm,
        created_at: user.created_at,
      })
    } catch (error) {
      fastify.log.error('Debug error:', error)
      return reply.code(500).send({ error: 'Debug failed' })
    }
  })
}
