import { Router } from 'express'
import { productManager } from '../services/ProductManager.service.js'
import { getLink } from '../utils.js'
import { cartManager } from '../services/CartManager.service.js'

const router = Router()

router.get('/products', async (req, res) => {
  try {
    const { limit, page, sort, query } = req.query
    if (limit && isNaN(Number(limit))) throw new Error('The param limit given must be a number')
    if (page && isNaN(Number(page))) throw new Error('The param page given must be a number')
    if (sort && sort !== 'asc' && sort !== 'desc') throw new Error('The param sort given must be a value "asc" or "desc" ')
    const result = await productManager.getProducts({ limit, page, sort, query })
    // Adding properties nextLink and prevLink to result
    const { prevLink, nextLink } = getLink(req, result)
    // Excluding some properties of the result
    const { docs, totalDocs, pagingCounter, ...resp } = result
    const resultFormatted = { status: 'success', payload: docs, ...resp, prevLink, nextLink }
    res.render('products', { ...resultFormatted, style: '/css/index.css', scriptPath: '/js/products.js' })
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message })
  }
})
router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts', { scriptPath: '/js/index.js', style: '/css/index.css' })
})

router.get('/carts/:cid', async (req, res) => {
  try {
    const { cid } = req.params
    if (typeof cid !== 'string') throw new Error('The id cart is invalid')
    if (!cid) res.status(406).send({ status: 'error', message: 'The id provided is invalid' })
    const cart = await cartManager.getCartById(cid)
    console.log(cart.products)
    if (!cart) throw new Error('Cart not found')
    const totalPrice = cart.products.reduce((acc, e) => acc + (e.quantity * e.product.price), 0).toFixed(2)
    res.render('cart', { style: '/css/index.css', products: cart.products, totalPrice, scriptPath: '/js/cart.js' })
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message })
  }
})
export default router
