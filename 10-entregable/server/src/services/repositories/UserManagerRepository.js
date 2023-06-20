import RegisterUserDTO from '../dao/DTOs/RegisterUserDTO.js'
import UserDTO from '../dao/DTOs/UserDTO.js'

export default class UserManagerRepository {
  constructor (dao) {
    this.dao = dao
  }

  async getByEmail ({ email, sensitive }) {
    const result = await this.dao.getByEmail({ email })
    if (result) {
      const userFormat = new UserDTO({ user: result, sensitive })
      return userFormat
    }
    return result
  }

  async getById (id, sensitive) {
    const result = await this.dao.getById(id)
    const userFormat = new UserDTO({ user: result, sensitive })
    return userFormat
  }

  async register (newUser, sensitive) {
    try {
      const regUserFormat = new RegisterUserDTO(newUser)
      const result = await this.dao.register(regUserFormat)
      const resultFormat = new UserDTO({ user: result, sensitive })
      return resultFormat
    } catch (error) {
      console.error(error, error.message)
      throw Error(error.message)
    }
  }

  async updateUser ({ email, updates, sensitive }) {
    const result = await this.dao.updateUser({ email, updates })
    const userFormat = new UserDTO({ user: result, sensitive })
    return userFormat
  }
}
