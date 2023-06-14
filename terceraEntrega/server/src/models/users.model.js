import mongoose from 'mongoose'
import { patterns } from '../utils.js'
const collectionName = 'users'

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      match: [patterns.firstName, 'The firstName must be contain only letters']
    },
    lastName: {
      type: String,
      match: [patterns.lastName, 'The lastName must be contain only letters']
    },
    fullName: String,
    email: {
      unique: true,
      type: String,
      match: [patterns.email, 'The email is not valid'],
      required: true
    },
    password: String,
    age: {
      type: Number,
      match: [patterns.age, 'The age is not valid'],
      min: [16, 'The min age allowed is 16'],
      max: [90, 'The max age allowed is 90']
    },
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER'
    },
    githubId: String,
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'carts'
    }
  }
)

const userModel = mongoose.model(collectionName, userSchema)

export default userModel
