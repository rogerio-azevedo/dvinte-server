import { Sequelize } from 'sequelize'
import { config } from 'dotenv'

// Load environment variables
config()

import databaseConfig from '../config/database.js'

class Database {
  public connection!: Sequelize

  constructor() {
    this.init()
  }

  init(): void {
    this.connection = new Sequelize(databaseConfig)
    // TODO: Initialize models after migration
  }

  async authenticate(): Promise<void> {
    await this.connection.authenticate()
  }
}

export default new Database()
