import { cartManager } from '../services/CartManager.service.js'
// POST /api/carts/
export async function createCart (req, res) {
  try {
    const result = await cartManager.createCart()
    if (!result) throw new Error('The cart was not created')
    res.send({
      status: 'success',
      message: 'Cart created successfully',
      cart: result
    })
  } catch (err) {
    res.status(500).send({ status: 'error', message: err.message })
  }
}
// GET /api/carts/:cid
export async function getCartById (req, res) {
  try {
    const { cid } = req.params
    if (typeof cid !== 'string') throw new Error('The id cart is invalid')
    if (!cid) {
      res.status(406).send({ status: 'error', message: 'The id provided is invalid' })
    }
    const result = await cartManager.getCartById(cid)
    if (!result) throw new Error('Cart not found')

    res.status(200).send({ status: 'success', payload: result })
  } catch (err) {
    res.status(500).send({ status: 'error', message: err.message })
  }
}
// PUT /api/carts/:cid/product/:pid
export async function updateProductInCart (req, res) {
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    const quantity = Number(req.body.quantity)
    if (typeof Number(quantity) !== 'number') throw new Error('The quantity must be a number')
    if (typeof cid !== 'string' || typeof pid !== 'string') throw new Error('The id provided must be a string')
    if (!cid || !pid) return res.send({ status: 'error', message: 'one or both given ids are invalid' })
    const result = await cartManager.updateProductInCart(cid, pid, quantity)
    if (!result) throw new Error('Cart or product not found')
    res.send({ status: 'success', message: `The product with id ${pid} was updated`, payload: result })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: 'error', message: err.message })
  }
}
// PUT /api/carts/:cid
export async function addProductstoCart (req, res) {
  try {
    const { cid } = req.params
    const products = req.body
    if (typeof cid !== 'string') throw new Error('The id provided must be a string')
    if (!Array.isArray(products)) throw new Error('The data received is not an Array')
    const result = await cartManager.addProductsToCart({ arrProducts: products, cartId: cid })
    res.send({ status: 'success', message: 'the products in the cart have been added', payload: result })
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message })
  }
}
// DELETE /api/carts/:cid/product/:pid
export async function deleteProductById (req, res) {
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    if (typeof cid !== 'string' || typeof pid !== 'string') throw new Error('The id provided must be a string')
    if (!cid || !pid) return res.send({ status: 'error', message: 'one or both given ids are invalid' })
    const result = await cartManager.deleteProductById({ cartId: cid, productId: pid })
    if (!result) throw new Error('Something wrong')
    res.send({ status: 'success', message: `The product with id ${pid} has been deleted`, payload: result })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: 'error', message: err.message })
  }
}
// DELETE /api/carts/:cid
export async function deleteAllproductsInCart (req, res) {
  try {
    const cid = req.params.cid
    if (typeof cid !== 'string') throw new Error('The id provided must be a string')
    if (!cid) throw new Error('cart id given invalid')
    const result = await cartManager.deleteAllproductsInCart({ cartId: cid })
    if (!result) throw new Error('Something wrong')
    if (result.modifiedCount === 0) res.send({ status: 'info', message: 'Product id not found', payload: result })
    if (result.modifiedCount === 1) res.send({ status: 'success', message: `The cart with id ${cid} has been emptied`, payload: result })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: 'error', message: err.message })
  }
}
