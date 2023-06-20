export default class ProductManagerRepository {
  constructor (dao) {
    this.dao = dao
  }

  async getAll ({ limit, page, sort, query }) {
    const result = await this.dao.getProducts({ limit, page, sort, query })
    return result
  }

  async getById (id) {
    const result = await this.dao.getProductById(id)
    return result
  }

  async addProduct (newProduct) {
    const result = await this.dao.addProduct(newProduct)
    return result
  }

  async updateProduct (pid, productUpdates) {
    const result = await this.dao.updateProduct(pid, productUpdates)
    return result
  }

  async deleteProductById (productId) {
    const result = await this.dao.deleteProductById(productId)
    return result
  }
}
