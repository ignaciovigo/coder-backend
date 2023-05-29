import mongoose from 'mongoose'

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
      await mongoose.connect(process.env.MONGO_URL, {
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
