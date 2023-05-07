import mongoose from 'mongoose'
import { patterns } from '../utils.js'
const collectionName = 'users'

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      match: patterns.firstName
    },
    lastName: {
      type: String,
      match: patterns.lastName
    },
    email: {
      unique: true,
      type: String,
      match: patterns.email,
      required: true
    },
    password: String,
    age: Number,
    role: {
      type: String,
      enum: ['Admin', 'User'],
      default: 'User'
    }
  }
)

const userModel = mongoose.model(collectionName, userSchema)

export default userModel
