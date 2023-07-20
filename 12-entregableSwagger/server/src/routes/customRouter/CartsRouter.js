import { addProductstoCart, createCart, deleteAllproductsInCart, deleteProductById, getCartById, updateProductInCart, purchase } from '../../controllers/carts.controller.js'
import CustomRouter from './CustomRouter.js'

export default class CartsRouter extends CustomRouter {
  init () {
    this.post('/', { policies: ['USER'], strategy: 'jwt' }, createCart)

    this.get('/:cid', { policies: ['USER'], strategy: 'jwt' }, getCartById)

    this.put('/:cid', { policies: ['USER'], strategy: 'jwt' }, addProductstoCart)

    this.delete('/:cid', { policies: ['USER'], strategy: 'jwt' }, deleteAllproductsInCart)

    this.put('/:cid/product/:pid', { policies: ['USER'], strategy: 'jwt' }, updateProductInCart)

    this.delete('/:cid/product/:pid', { policies: ['USER'], strategy: 'jwt' }, deleteProductById)
    this.post('/:cid/purchase', { policies: ['USER'], strategy: 'jwt' }, purchase)
  }
}
