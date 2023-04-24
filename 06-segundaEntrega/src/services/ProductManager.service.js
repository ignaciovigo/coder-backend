import productModel from '../models/products.models.js'
import { patterns } from '../utils.js'

class ProductManager {
  static #productManagerUnique
  constructor () {
    if (!ProductManager.#productManagerUnique) {
      ProductManager.#productManagerUnique = this
    }
    return ProductManager.#productManagerUnique
  }

  // returns a list of documents according to the indicated search
  async getProducts ({ limit = 10, page = 1, sort = null, query }) {
    try {
      const inputQuery = query ? { category: query, stock: { $gt: 0 } } : {}
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
     once its been validated, also adds it an id */
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
    try {
      const result = await productModel.updateOne({ _id: idGiven }, productToUpdate)
      return result
    } catch (error) {
      if (error.name === 'CastError') throw new Error(`Invalid ${error.path}: ${error.value}`)
    }
  }

  async deleteProductById (id) {
    try {
      const result = await productModel.deleteOne({ _id: id })
      return result
    } catch (error) {
      if (error.name === 'CastError') throw new Error(`Invalid ${error.path}: ${error.value}`)
    }
  }
}

export const productManager = new ProductManager()
