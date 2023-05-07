import { Router } from 'express'
import { updateProductInCart, createCart, getCartById, addProductstoCart, deleteProductById, deleteAllproductsInCart } from '../controllers/carts.controller.js'

const router = Router()

router.post('/', createCart)

router.get('/:cid', getCartById)

router.put('/:cid', addProductstoCart)

router.delete('/:cid', deleteAllproductsInCart)

router.put('/:cid/product/:pid', updateProductInCart)

router.delete('/:cid/product/:pid', deleteProductById)

export default router
