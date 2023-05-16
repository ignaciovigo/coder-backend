import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../../controllers/products.controller.js'
import CustomRouter from './CustomRouter.js'

export default class ProductsRouter extends CustomRouter {
  init () {
    this.get('/', { policies: ['PUBLIC'] }, getProducts)

    this.get('/:pid', { policies: ['PUBLIC'] }, getProductById)

    this.post('/', { policies: ['PUBLIC'] }, addProduct)

    this.put('/:pid', { policies: ['PUBLIC'] }, updateProduct)

    this.delete('/:pid', { policies: ['PUBLIC'] }, deleteProduct)
  }
}
