import mongoose from 'mongoose'
import config from './config.js'

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
      await mongoose.connect(config.mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      //customLogger.info('Connection to the database successfully!')
      console.log('Connected to db');
    } catch (error) {
      //customLogger.fatal(`Could not connect to the database. reason: ${error.message}`)
      console.log(`Error to connect ${error}`);
      process.exit()
    }
  }
}
