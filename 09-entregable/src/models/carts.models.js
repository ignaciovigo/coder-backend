import mongoose from 'mongoose'

const collectionName = 'carts'

const cartSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
          },
          quantity: {
            type: Number,
            default: 1,
            required: true
          }
        }
      ],
      default: []
    }
  }
)

// Middleware para utilizar el meotodo populate dentro de products
cartSchema.pre('findOne', function () {
  this.populate('products.product')
})
const cartModel = mongoose.model(collectionName, cartSchema)
export default cartModel
