import * as fs from 'fs'

const pattern = {
  title: /^([a-zA-ZáÁéÉíÍóÓúÚñÑÜü]([0-9\s]+)?)+$/,
  description: /^[a-zA-ZáÁéÉíÍóÓúÚñÑÜü].+$/,
  price: /^(0|[1-9]\d*)(\.\d+)?$/,
  stock: /^[0-9]+$/
}

class ProductManager {
  #filePath
  static idProduct = 100
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

  validateProduct ({ title, description, price, thumbnails, code, stock, status = true, category }) {
    /* validates each property of the given object */
    if (!title || !description || !price || !code || !stock || !category) {
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
    if (!pattern.description.test(category)) {
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
    this.validateProduct(newProduct)
    if (await this.isCodeExist(newProduct.code)) {
      throw new Error('The product code provided already exists')
    }
    newProduct.id = ++ProductManager.idProduct
    const productsJson = await this.checkFile()
    const productsParsed = JSON.parse(productsJson)
    productsParsed.push(newProduct)
    await fs.promises.writeFile(
      this.#filePath,
      JSON.stringify(productsParsed, null, 2)
    )
  }

  async updateProduct (idGiven, productToUpdate) {
    const product = await this.getProductById(idGiven)
    const productsJson = await this.checkFile()
    const productsParsed = JSON.parse(productsJson)
    const index = productsParsed.findIndex((e) => e.id === idGiven)
    if (index >= 0) {
      for (const key in productToUpdate) {
        if (product.hasOwnProperty(key) && key !== 'id') {
          if (key === 'code' && await this.isCodeExist(productToUpdate[key])) throw new Error('The new code provided already exists')
          product[key] = productToUpdate[key]
        } else {
          throw new Error('one of the properties provided is invalid')
        }
      }
      this.validateProduct(product)
      productsParsed[index] = { ...product }
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

export const productManager = new ProductManager()