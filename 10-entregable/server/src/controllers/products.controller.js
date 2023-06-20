import CustomError from '../services/errors/CustomError.js'
import EErrors from '../services/errors/enums.js'
import { createProductErrorInfo } from '../services/errors/info.js'
import { productService } from '../services/repositories/index.js'
import { getLink } from '../utils.js'

// Controller for /api/products and some query params
export async function getProducts (req, res) {
  try {
    const { limit, page, sort, query } = req.query
    if (limit && isNaN(Number(limit))) return res.sendUserError('The limit param given must be a number')
    if (page && isNaN(Number(page))) return res.sendUserError('The page param given must be a number')
    if (sort && sort !== 'asc' && sort !== 'desc') return res.sendUserError('The sort param given must be a value "asc" or "desc" ')
    const result = await productService.getAll({ limit, page, sort, query })
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
    const result = await productService.getById(pid)
    if (!result) return res.sendUserError('Product not found')
    return res.sendSuccess(result)
  } catch (err) {
    return res.sendServerError(err.message)
  }
}
// controller for POST /api/products
export async function addProduct (req, res) {

    const { title, description, price, thumbnails, code, stock, status, category } = req.body
    if (!title || !description || !price || !thumbnails || !code || !stock || typeof status !== 'boolean' || !category) {
      CustomError.createError({
        name: 'Create Product Error',
        cause: createProductErrorInfo({ ...req.body }),
        message: 'Error trying to create a product. its possible one or more fields are invalid',
        code: EErrors.INVALID_TYPES_ERROR
      })
    }
    // if (!newProduct) return res.sendUserError('The data received is incorrect')
    const result = await productService.addProduct({ title, description, price, thumbnails, code, stock, status, category })
    if (!result) return res.sendServerError('Could not add product')
    return res.sendSuccessInfo(`Product added with id ${result._id}`)

}
// Controller for PUT /api/products/:pid
export async function updateProduct (req, res) {
  try {
    const { pid } = req.params
    const productUpdates = req.body
    if (typeof pid !== 'string') return res.sendUserError('The id provided must be a string')
    const result = await productService.updateProduct(pid, productUpdates)
    if (!result) return res.sendUserError('Product not found')
    return res.sendSuccessInfo(result)
  } catch (err) {
    if (err.name === 'client') return res.sendUserError(err.message)
    return res.sendServerError(err.message)
  }
}
// Controller for DEL /api/products/:pid
export async function deleteProduct (req, res) {
  try {
    const { pid } = req.params
    if (typeof pid !== 'string') return res.sendUserError('The id provided must be a string')
    const result = await productService.deleteProductById(pid)
    if (!result) return res.sendUserError('Product not found')
    return res.sendSuccessInfo(result)
  } catch (error) {
    if (error.name === 'client') return res.sendUserError(error.message)
    return res.sendServerError(error.message)
  }
}
