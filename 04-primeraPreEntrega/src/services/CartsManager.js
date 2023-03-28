import fs from 'fs'
import { productManager } from './ProductManager.js'

class CartManager {
  #filePath
  static idCart = 0
  constructor () {
    this.#filePath = './carts.json'
  }

  async checkFile () {
    /* returns the content of the carts.json
    if it doesn't exist it'll create one with [] */
    if (!fs.existsSync(this.#filePath)) {
      await fs.promises.writeFile(this.#filePath, '[]')
    }
    let cartsJson = await fs.promises.readFile(this.#filePath, 'utf-8')
    if (cartsJson === '') cartsJson = '[]'
    return cartsJson
  }

  async createCart () {
    /* create a cart with the properties id and products  */
    const newCart = {
      id: ++CartManager.idCart,
      products: []
    }
    const cartsJson = await this.checkFile()
    const cartsParsed = JSON.parse(cartsJson)
    cartsParsed.push(newCart)
    await fs.promises.writeFile(
      this.#filePath,
      JSON.stringify(cartsParsed, null, 2)
    )
  }

  async getCartById (id) {
    const cartJson = await this.checkFile()
    const cartsParsed = JSON.parse(cartJson)
    const cart = cartsParsed.find(e => e.id === id)
    if (cart === undefined) throw new Error('Cart not found')
    return cart
  }

  async addProductToCartByIds (idCartGiven, idProductGiven) {
    const cart = await this.getCartById(idCartGiven)
    const cartJson = await this.checkFile()
    const cartsParsed = JSON.parse(cartJson)
    const indexCart = cartsParsed.findIndex(e => e.id === idCartGiven)
    if (indexCart === -1) throw new Error('The cart was not found')
    const { id } = await productManager.getProductById(idProductGiven)
    const indexProductInCart = cart.products.findIndex(e => e.product === id)
    if (indexProductInCart >= 0) {
      cart.products[indexProductInCart].quantity += 1
    } else {
      cart.products.push({ product: id, quantity: 1 })
    }
    cartsParsed[indexCart] = { ...cart }
    await fs.promises.writeFile(this.#filePath, JSON.stringify(cartsParsed, null, 2))
  }
}

export const cartManager = new CartManager()
