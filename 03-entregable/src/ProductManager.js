import * as fs from 'fs'
import * as crypto from 'crypto'

const pattern = {
  title: /^([a-zA-ZáÁéÉíÍóÓúÚñÑÜü]([0-9\s]+)?)+$/,
  description: /^[a-zA-ZáÁéÉíÍóÓúÚñÑÜü].+$/,
  price: /^(0|[1-9]\d*)(\.\d+)?$/,
  stock: /^[0-9]+$/
}

class ProductManager {
  #filePath
  constructor () {
    this.#filePath = './products.json'
  }

  async getProducts () {
    /* returns the products list */
    const productsJson = await this.checkFile()
    return JSON.parse(productsJson)
  }

  async checkFile () {
    /* returns the content of the file.json
    if it does exist it'll create one with [] */
    if (!fs.existsSync(this.#filePath)) {
      await fs.promises.writeFile(this.#filePath, '[]')
    }
    let productsJson = await fs.promises.readFile(this.#filePath, 'utf-8')
    if (productsJson === '') productsJson = '[]'
    return productsJson
  }

  async getProductById (id) {
    /*
    given an id returns the element of the list of products that contains it
     otherwise it returns an error not found
    */
    const productsJson = await this.checkFile()
    const productsParsed = JSON.parse(productsJson)
    const product = productsParsed.find((e) => e.id === id)
    if (!product) throw Error('Product does not exist')
    return product
  }

  async isCodeExist (code) {
    /* returns a boolean if the given code exists in the products list */
    const usersJson = await this.checkFile()
    const productsParsed = JSON.parse(usersJson)
    return productsParsed.some((e) => e.code === code)
  }

  validateProduct ({ title, description, price, thumbnail, code, stock }) {
    /* validates each property of the given object */
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      throw new Error('Not all required fields were provided')
    }
    if (!pattern.title.test(title)) {
      throw new Error('The title provided must be and start with a string')
    }
    if (!pattern.description.test(description)) {
      throw new Error('The description provided must start with a string')
    }
    if (!pattern.price.test(price) || typeof price !== 'number') {
      throw new Error('The price provided must be a number')
    }
    if (!pattern.stock.test(stock) || typeof stock !== 'number') {
      throw new Error('The stock provided must be an integer')
    }
  }

  async addProduct (title, description, price, thumbnail, code, stock) {
    /* transforms the given product data into an object and adds it to the products list
     once its been validated, also adds it an id */
    const product = { title, description, price, thumbnail, code, stock }
    this.validateProduct(product)
    if (await this.isCodeExist(code)) {
      throw new Error('The product code provided already exists')
    }
    product.id = crypto.randomUUID().slice(0, 7)
    const productsJson = await this.checkFile()
    const productsParsed = JSON.parse(productsJson)
    productsParsed.push(product)
    await fs.promises.writeFile(
      this.#filePath,
      JSON.stringify(productsParsed, null, 2)
    )
  }

  async updateProduct (idGiven, productToUpdate) {
    const { id } = await this.getProductById(idGiven)
    this.validateProduct(productToUpdate)
    const productsJson = await this.checkFile()
    const productsParsed = JSON.parse(productsJson)
    const index = productsParsed.findIndex((e) => e.id === idGiven)
    if (index >= 0) {
      productsParsed[index] = { ...productToUpdate, id }
      await fs.promises.writeFile(
        this.#filePath,
        JSON.stringify(productsParsed, null, 2)
      )
    }
  }

  async deleteProductById (id) {
    const productsJson = await this.checkFile()
    const productsParsed = JSON.parse(productsJson)
    const index = productsParsed.findIndex((e) => e.id === id)
    if (index === -1) throw new Error('The id provided was not found')
    productsParsed.splice(index, 1)
    await fs.promises.writeFile(
      this.#filePath,
      JSON.stringify(productsParsed, null, 2)
    )
  }

  async deleteAll () {
    await this.checkFile()
    await fs.promises.writeFile(this.#filePath, '')
  }
}

export default ProductManager
