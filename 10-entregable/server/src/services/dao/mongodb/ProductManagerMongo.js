import productModel from '../../../models/products.models.js'
import { patterns } from '../../../utils.js'

export default class ProductManagerMongo {
  static #instance
  constructor () {
    if (!ProductManagerMongo.#instance) {
      ProductManagerMongo.#instance = this
      return
    }
    return ProductManagerMongo.#instance
  }

  // returns a list of documents according to the indicated search
  async getProducts ({ limit = 10, page = 1, sort = null, query }) {
    try {
      const inputQuery = query ? { $or: [{ category: { $regex: '^' + query, $options: 'i' } }, { title: { $regex: query, $options: 'i' } }], stock: { $gt: 0 } } : {}
      const result = await productModel.paginate(inputQuery, { limit, page, sort: { price: sort }, lean: true })
      return result
    } catch (error) {
      throw Error('The params received from the url are incorrect')
    }
  }

  async getProductById (id) {
  /*
    given an id returns one product of the list of products by id if contains it
     otherwise it returns an error not found
  */
    try {
      const product = await productModel.findOne({ _id: id })
      return product
    } catch (error) {
      throw Error('The id provided is invalid')
    }
  }

  validateProduct ({ title, description, price, thumbnails, code, stock, status = true, category }) {
    /* validates each property of the given object */
    if (!title || !description || !price || !code || !stock || !category) {
      throw new Error('Not all required fields were provided')
    }
    if (!patterns.title.test(title)) {
      throw new Error('The title provided must be and start with a string')
    }
    if (!patterns.description.test(description)) {
      throw new Error('The description provided must start with a string')
    }
    if (!patterns.price.test(price) || typeof price !== 'number') {
      throw new Error('The price provided must be a number')
    }
    if (!patterns.stock.test(stock) || typeof stock !== 'number') {
      throw new Error('The stock provided must be an integer')
    }
    if (!patterns.description.test(category)) {
      throw new Error('The category provided must be a string')
    }
    if (typeof status !== 'boolean') {
      throw new Error('The status provided must be a boolean')
    }
    if (thumbnails && !Array.isArray(thumbnails)) {
      throw new Error('The property thumbnails must be an array')
    }
  }

  async addProduct (newProduct) {
    /* adds the object received to the products list
     once its been validated */
    try {
      this.validateProduct(newProduct)
      const result = await productModel.create(newProduct)
      return result
    } catch (error) {
      if (error.code === 11000) throw Error('Cannot add products with duplicate code')
      throw error
    }
  }

  async updateProduct (idGiven, productToUpdate) {
    // Update a product by id
    try {
      const result = await productModel.updateOne({ _id: idGiven }, productToUpdate)
      if (result.modifiedCount === 1) return 'The product was updated'
      if (result.matchedCount === 1 && result.modifiedCount === 0) return 'The product is already modified with the same properties'
      if (result.matchedCount === 0) return null
      if (!result.acknowledged) throw { name: 'client', message: 'Properties given are not reconognized' }
      return result
    } catch (error) {
      if (error.name === 'CastError') throw new Error(`Invalid ${error.path}: ${error.value}`)
    }
  }

  async deleteProductById (id) {
    // delete product by id
    try {
      const result = await productModel.deleteOne({ _id: id })
      if (result.deletedCount === 1) return 'The product was deleted successfully'
      if (result.acknowledged && result.deletedCount === 0) return null
      if (!result.acknowledged) throw { name: 'client', message: 'The data to perform the query is incorrect' }
      return result
    } catch (error) {
      if (error.name === 'CastError') throw new Error(`Invalid ${error.path}: ${error.value}`)
    }
  }
}
