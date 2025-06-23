import { config } from 'dotenv'
import { Options } from 'sequelize'

// Load environment variables
config()

const databaseConfig: Options = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    timestamps: true,
    underscored: true,
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
}

export default databaseConfig
