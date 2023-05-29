import { addProductstoCart, createCart, deleteAllproductsInCart, deleteProductById, getCartById, updateProductInCart } from '../../controllers/carts.controller.js'
import CustomRouter from './CustomRouter.js'

export default class CartsRouter extends CustomRouter {
  init () {
    this.post('/', { policies: ['PUBLIC'] }, createCart)

    this.get('/:cid', { policies: ['PUBLIC'] }, getCartById)

    this.put('/:cid', { policies: ['PUBLIC'] }, addProductstoCart)

    this.delete('/:cid', { policies: ['PUBLIC'] }, deleteAllproductsInCart)

    this.put('/:cid/product/:pid', { policies: ['PUBLIC'] }, updateProductInCart)

    this.delete('/:cid/product/:pid', { policies: ['PUBLIC'] }, deleteProductById)
  }
}
