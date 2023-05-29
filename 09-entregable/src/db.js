import mongoose from 'mongoose'
import config from './config/config.js'

export class ConnectionToMDB {
  static #instance
  constructor () {
    this.#connectMongoDB()
  }

  static getInstance () {
    if (!this.#instance) {
      this.#instance = new ConnectionToMDB()
    }
    return this.#instance
  }

  #connectMongoDB = async () => {
    try {
      await mongoose.connect(config.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      console.log('Connection to the database successfully!')
    } catch (error) {
      console.log('Could not connect to the database', error)
      process.exit()
    }
  }
}
