import { productManager } from '../services/ProductManager.service.js'
import { getLink } from '../utils.js'

// Controller for /api/products and some query params
export async function getProducts (req, res) {
  try {
    const { limit, page, sort, query } = req.query
    if (limit && isNaN(Number(limit))) return res.sendUserError('The param limit given must be a number')
    if (page && isNaN(Number(page))) return res.sendUserError('The param page given must be a number')
    if (sort && sort !== 'asc' && sort !== 'desc') return res.sendUserError('The param sort given must be a value "asc" or "desc" ')
    const result = await productManager.getProducts({ limit, page, sort, query })
    // Adding properties nextLink and prevLink to result
    const { prevLink, nextLink } = getLink(req, result)
    // Excluding some properties of the result
    const { docs, totalDocs, pagingCounter, ...resp } = result
    return res.sendSuccess({ docs, ...resp, prevLink, nextLink })
  } catch (error) {
    return res.sendServerError(error.message)
  }
}

// Controller for GET /api/products/:pid
export async function getProductById (req, res) {
  try {
    const { pid } = req.params
    if (typeof pid !== 'string') return res.sendUserError('The id provided must be a string')
    const result = await productManager.getProductById(pid)
    if (!result) return res.sendUserError('Product not found')
    return res.sendSuccess(result)
  } catch (err) {
    return res.sendServerError(err.message)
  }
}
// controller for POST /api/products
export async function addProduct (req, res) {
  try {
    const newProduct = req.body
    if (!newProduct) return res.sendUserError('The data received is incorrect')
    const result = await productManager.addProduct(newProduct)
    if (!result) return res.sendServerError('Could not add product')
    return res.sendSuccessInfo(`Product added with id ${result._id}`)
  } catch (err) {
    return res.sendServerError(err.message)
  }
}
// Controller for PUT /api/products/:pid
export async function updateProduct (req, res) {
  try {
    const { pid } = req.params
    const productUpdates = req.body
    if (typeof pid !== 'string') return res.sendUserError('The id provided must be a string')
    const result = await productManager.updateProduct(pid, productUpdates)
    if (!result) return res.sendUserError('Product not found')
    if (result.modifiedCount === 1) return res.sendSuccessInfo(`The product with id: ${pid} was updated`)
    if (result.matchedCount === 1 && result.modifiedCount === 0) return res.sendSuccessInfo('The product is already modified with the same properties')
    if (result.matchedCount === 0) return res.sendUserError('Product not found')
    if (!result.acknowledged) return res.sendUserError('Properties given are not reconognized')
  } catch (err) {
    return res.sendServerError(err.message)
  }
}
// Controller for DEL /api/products/:pid
export async function deleteProduct (req, res) {
  try {
    const { pid } = req.params
    if (typeof pid !== 'string') return res.sendUserError('The id provided must be a string')
    const result = await productManager.deleteProductById(pid)
    if (!result) return res.sendUserError('Product not found')
    if (result.deletedCount === 1) return res.sendSuccessInfo(`The product with id: ${pid} was deleted`)
    if (result.acknowledged && result.deletedCount === 0) return res.sendUserError(`doesnt exist product with id: ${pid}`)
    if (!result.acknowledged) return res.sendUserError('The data to perform the query is incorrect')
  } catch (error) {
    return res.sendServerError(error.message)
  }
}
