import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const collectionName = 'ticket'

const ticketSchema = mongoose.Schema(
  {
    email: {
      type: String
    },
    code: {
      type: String,
      unique: true,
      required: true
    },
    time: {
      type: Date,
      default: Date.now
    },
    amount: {
      type: Number
    },
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
          },
          quantity: Number
        }
      ]
    },
    purchaser: {
      type: String
    }
  }
)
ticketSchema.plugin(mongoosePaginate)
ticketSchema.pre('findOne', function () {
  this.populate('products.product')
})
const ticketModel = mongoose.model(collectionName, ticketSchema)

export default ticketModel
