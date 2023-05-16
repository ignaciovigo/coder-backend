import { cartManager } from '../services/CartManager.service.js'
// POST /api/carts/
export async function createCart (req, res) {
  try {
    const result = await cartManager.createCart()
    if (!result) return res.sendServerError('The cart was not created')
    return res.sendSuccess(result)
  } catch (err) {
    return res.sendServerError(err.message)
  }
}
// GET /api/carts/:cid
export async function getCartById (req, res) {
  try {
    const { cid } = req.params
    if (typeof cid !== 'string') return res.sendUserError('The id cart is invalid')
    if (!cid) {
      return res.sendUserError('The id provided is invalid')
    }
    const result = await cartManager.getCartById(cid)
    if (!result) return res.sendUserError('Cart not found')
    return res.sendSuccess(result)
  } catch (err) {
    return res.sendServerError(err.message)
  }
}
// PUT /api/carts/:cid/product/:pid
export async function updateProductInCart (req, res) {
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    const quantity = Number(req.body.quantity)
    if (typeof Number(quantity) !== 'number') return res.sendUserError('The quantity must be a number')
    if (typeof cid !== 'string' || typeof pid !== 'string') return res.sendUserError('The id provided must be a string')
    if (!cid || !pid) return res.sendUserError('One or both given ids are invalid')
    const result = await cartManager.updateProductInCart(cid, pid, quantity)
    if (!result) return res.sendUserError('Cart or product not found')
    return res.sendSuccess(result)
  } catch (err) {
    console.log(err)
    return res.sendServerError(err.message)
  }
}
// PUT /api/carts/:cid
export async function addProductstoCart (req, res) {
  try {
    const { cid } = req.params
    const products = req.body
    if (typeof cid !== 'string') return res.sendUserError('The id provided must be a string')
    if (!Array.isArray(products)) return res.sendUserError('The data received is not an Array')
    const result = await cartManager.addProductsToCart({ arrProducts: products, cartId: cid })
    if (!result) return res.sendUserError('One or both ids provided are invalid')
    return res.sendSuccess(result)
  } catch (error) {
    return res.sendServerError(error.message)
  }
}
// DELETE /api/carts/:cid/product/:pid
export async function deleteProductById (req, res) {
  try {
    const cid = req.params.cid
    const pid = req.params.pid
    if (typeof cid !== 'string' || typeof pid !== 'string') return res.sendUserError('The id provided must be a string')
    if (!cid || !pid) return res.sendUserError('one or both given ids are invalid')
    const result = await cartManager.deleteProductById({ cartId: cid, productId: pid })
    if (!result) return res.sendServerError('Could not deleted the product')
    return res.sendSuccess(result)
  } catch (err) {
    console.log(err)
    return res.sendServerError(err.message)
  }
}
// DELETE /api/carts/:cid
export async function deleteAllproductsInCart (req, res) {
  try {
    const cid = req.params.cid
    if (typeof cid !== 'string') return res.sendUserError('The id provided must be a string')
    if (!cid) return res.sendUserError('cart id given invalid')
    const result = await cartManager.deleteAllproductsInCart({ cartId: cid })
    if (!result) return res.sendUserError('Could not deleted the products')
    if (result.modifiedCount === 0) return res.sendUserError('Product id not found')
    if (result.modifiedCount === 1) return res.sendSuccessInfo(`The cart with id ${cid} has been emptied`)
  } catch (err) {
    console.log(err)
    return res.sendServerError(err.message)
  }
}
