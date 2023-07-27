export default class CartManagerRepository {
  constructor (dao) {
    this.dao = dao
  }

  async createCart () {
    const result = await this.dao.create()
    return result
  }

  async getCart (id) {
    const result = await this.dao.get(id)
    return result
  }

  async updateProduct ({ idCartGiven, idProductGiven, quantity = 1 }) {
    const result = await this.dao.updateProduct({ idCartGiven, idProductGiven, quantity })
    return result
  }

  async insertProducts ({ arrProducts, cartId }) {
    const result = await this.dao.insertProducts({ arrProducts, cartId })
    return result
  }

  async deleteProductById ({ cartId, productId }) {
    const result = await this.dao.deleteProductById({ cartId, productId })
    return result
  }

  async clearCart ({ cartId }) {
    const result = await this.dao.clearCart({ cartId })
    return result
  }
}
