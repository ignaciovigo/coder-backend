import mongoose from 'mongoose'
import config from './config/config.js'
import { customLogger } from './config/logger.js'

export default class ConnectionToMDB {
  static #instance
  constructor () {
    this.#connectMongoDB()
  }

  static getInstance () {
    if (!this.#instance) {
      this.#instance = new ConnectionToMDB()
      return
    }
    return this.#instance
  }

  #connectMongoDB = async () => {
    try {
      await mongoose.connect(config.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      customLogger.info('Connection to the database successfully!')
    } catch (error) {
      customLogger.fatal(`Could not connect to the database. reason: ${error.message}`)
      process.exit()
    }
  }
}
