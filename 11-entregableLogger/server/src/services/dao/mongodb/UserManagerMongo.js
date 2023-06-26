import userModel from '../../../models/users.model.js'

export default class userManagerMongo {
  static #instance
  constructor () {
    if (!userManagerMongo.#instance) {
      userManagerMongo.#instance = this
      return
    }
    return userManagerMongo.#instance
  }

  async getByEmail ({ email }) {
    try {
      const user = await userModel.findOne({ email })
      return user
    } catch (error) {
      throw Error(error.message)
    }
  }

  async getById ({ id }) {
    try {
      const user = await userModel.findOne({ _id: id })
      return user
    } catch (error) {
      throw Error(error.message)
    }
  }

  async register (newUser) {
    try {
      const result = await userModel.create(newUser)
      return result
    } catch (error) {
      throw Error(error.message)
    }
  }

  async updateUser ({ email, updates }) {
    try {
      const userUpdated = await userModel.findOneAndUpdate(
        { email },
        { ...updates },
        { new: true }
      )
      return userUpdated
    } catch (error) {
      throw Error(`Could not modify the user: ${error.message}`)
    }
  }
}
