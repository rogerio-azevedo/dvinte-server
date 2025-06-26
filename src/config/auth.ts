import { config } from 'dotenv'

config()

interface AuthConfig {
  secret: string | undefined
  expiresIn: string
}

const authConfig: AuthConfig = {
  secret: process.env.APP_SECRET,
  expiresIn: '30d',
}

export default authConfig
