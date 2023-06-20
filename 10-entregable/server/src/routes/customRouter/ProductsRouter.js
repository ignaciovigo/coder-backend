import { addProduct, deleteProduct, getProductById, getProducts, updateProduct } from '../../controllers/products.controller.js'
import CustomRouter from './CustomRouter.js'

export default class ProductsRouter extends CustomRouter {
  init () {
    this.get('/', { policies: ['USER', 'ADMIN'], strategy: 'jwt' }, getProducts)

    this.get('/:pid', { policies: ['USER', 'ADMIN'], strategy: 'jwt' }, getProductById)

    this.post('/', { policies: ['ADMIN'], strategy: 'jwt' }, addProduct)

    this.put('/:pid', { policies: ['ADMIN'], strategy: 'jwt' }, updateProduct)

    this.delete('/:pid', { policies: ['ADMIN'], strategy: 'jwt' }, deleteProduct)
  }
}
