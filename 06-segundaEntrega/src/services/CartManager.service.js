import cartModel from '../models/carts.models.js'

class CartManager {
  static #cartManagerUnique
  constructor () {
    if (!CartManager.#cartManagerUnique) {
      CartManager.#cartManagerUnique = this
    }
    return CartManager.#cartManagerUnique
  }

  async createCart () {
    // create cart
    try {
      const newCart = await cartModel.create({})
      return newCart
    } catch (error) {
      throw Error(error)
    }
  }

  async getCartById (id) {
    try {
      const cart = await cartModel.findOne({ _id: id }).lean()
      return cart
    } catch (error) {
      if (error.name === 'CastError') throw new Error(`Invalid ${error.path}: ${error.value}`)
      throw Error(`${error.reason}`)
    }
  }

  async updateProductInCart (idCartGiven, idProductGiven, quantity = 1) {
    try {
      let cartUpdated = await cartModel.findOneAndUpdate(
        { _id: idCartGiven, 'products.product': idProductGiven },
        { $inc: { 'products.$.quantity': quantity } },
        { new: true }
      ).populate('products.product')
      if (cartUpdated) {
        return cartUpdated
      } else {
        cartUpdated = await cartModel.findOneAndUpdate(
          { _id: idCartGiven },
          { $addToSet: { products: { product: idProductGiven, quantity } } },
          { new: true }
        ).populate('products.product')

        return cartUpdated
      }
    } catch (error) {
      throw Error(`Something wrong, ${error}`)
    }
  }

  async addProductsToCart ({ arrProducts, cartId }) {
    try {
      const result = await cartModel.findOneAndUpdate(
        { _id: cartId },
        { products: arrProducts },
        { new: true }
      )
      return result
    } catch (error) {
      throw Error(`Something wrong, ${error}`)
    }
  }

  async deleteProductById ({ cartId, productId }) {
    try {
      const result = await cartModel.findOneAndUpdate(
        { _id: cartId },
        { $pull: { products: { product: productId } } },
        { new: true }
      )
      if (!result) throw new Error('Could not delete the product')
      return result
    } catch (error) {
      if (error.name === 'CastError') throw Error('Not exist a product with the id received')
      throw Error(`Something wrong, ${error}`)
    }
  }

  async deleteAllproductsInCart ({ cartId }) {
    try {
      const result = await cartModel.updateOne(
        { _id: cartId },
        { products: [] }
      )
      if (!result) throw new Error('Could not delete the product')
      return result
    } catch (error) {
      if (error.name === 'CastError') throw Error('Not exist a cart with the id received')
      throw Error(`Something wrong, ${error}`)
    }
  }
}

export const cartManager = new CartManager()
