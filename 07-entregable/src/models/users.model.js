import mongoose from 'mongoose'
import { patterns } from '../utils.js'
const collectionName = 'users'

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      match: patterns.firstName,
      require: true
    },
    lastName: {
      type: String,
      match: patterns.lastName,
      require: true
    },
    email: {
      unique: true,
      type: String,
      match: patterns.email,
      require: true
    },
    password: String,
    age: Number
  }
)

const userModel = mongoose.model(collectionName, userSchema)

export default userModel
