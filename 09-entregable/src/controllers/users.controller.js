import userModel from '../models/users.model.js'
import { createHash } from '../utils.js'

export async function registerUser (req, res) {
  const { firstName, lastName, email, age, password } = req.body
  if (!firstName || !lastName || !email || !age || !password) {
    return res.sendUserError('The fields provided are incompleted')
  }
  try {
    const user = await userModel.findOne({ email })
    if (user) {
      return res.sendUserError('The email is already in use')
    } else {
      const newUser = {
        firstName,
        lastName,
        email,
        age,
        password: createHash(password),
        role: (email === 'fran@example.com') ? 'ADMIN' : 'USER'
      }
      const result = await userModel.create(newUser)
      if (!result) throw Error('Error during registering user to the database')
      return res.sendSuccessInfo('User created successfully!')
    }
  } catch (error) {
    return res.sendServerError(`could not register the user: ${error} `)
  }
}

export async function getUserData (req, res) {
  try {
    return res.sendSuccess(req.user)
  } catch (error) {
    return res.sendServerError(`Could not get the user data ${error}`)
  }
}
