import mongoose from 'mongoose'
import { patterns } from '../utils.js'
import mongoosePaginate from 'mongoose-paginate-v2'

const collectionName = 'products'
const productsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      match: patterns.title,
      required: true
    },
    description: {
      type: String,
      match: patterns.description,
      required: true
    },
    stock: {
      type: Number,
      match: patterns.stock,
      required: true
    },
    price: {
      type: Number,
      match: patterns.price,
      required: true
    },
    category: {
      type: String,
      match: patterns.description,
      required: true
    },
    thumbnails: {
      type: Array,
      required: true,
      validate: [
        {
          validator: (value) => {
            return (value.every(e => patterns.urlsImages.test(e)))
          },
          message: 'thumbnails dont contain image urls inside'
        }
      ],
      default: []
    },
    code: {
      type: String,
      unique: true,
      required: true
    },
    status: {
      type: Boolean,
      default: true
    }
  }
)
productsSchema.plugin(mongoosePaginate)
const productModel = mongoose.model(collectionName, productsSchema)
export default productModel
