import { productManager } from '../services/ProductManager.service.js'
import { getLink } from '../utils.js'

// Controller for /api/products and some query params
export async function getProducts (req, res) {
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
    res.status(200).send({ status: 'success', payload: docs, ...resp, prevLink, nextLink })
  } catch (error) {
    res.status(400).send({ status: 'error', message: error.message })
  }
}

// Controller for GET /api/products/:pid
export async function getProductById (req, res) {
  try {
    const { pid } = req.params
    if (typeof pid !== 'string') throw new Error('The id provided must be a string')
    const result = await productManager.getProductById(pid)
    if (!result) throw new Error('Product not found')
    res.status(200).send({ status: 'success', payload: result })
  } catch (err) {
    res.status(406).send({ status: 'error', message: err.message })
  }
}
// controller for POST /api/products
export async function addProduct (req, res) {
  try {
    const newProduct = req.body
    const result = await productManager.addProduct(newProduct)
    res.send({ status: 'success', message: `Product added with id ${result._id}` })
  } catch (err) {
    res.status(406).send({ status: 'error', message: err.message })
  }
}
// Controller for PUT /api/products/:pid
export async function updateProduct (req, res) {
  try {
    const { pid } = req.params
    const productUpdates = req.body
    if (typeof pid !== 'string') throw new Error('The id provided must be a string')
    const result = await productManager.updateProduct(pid, productUpdates)
    if (!result) throw new Error('Product not found')
    if (result.modifiedCount === 1) res.status(200).send({ status: 'success', message: `The product with id: ${pid} was updated` })
    if (result.matchedCount === 1 && result.modifiedCount === 0)res.status(202).send({ status: 'info', message: 'The product its already modified with the same properties' })
    if (result.matchedCount === 0)res.status(202).send({ status: 'info', message: 'Product not found' })
    if (!result.acknowledged) throw Error('Properties given are not reconognized')
  } catch (err) {
    res.status(406).send({ status: 'error', message: err.message })
  }
}
// Controller for DEL /api/products/:pid
export async function deleteProduct (req, res) {
  try {
    const { pid } = req.params
    if (typeof pid !== 'string') throw new Error('The id provided must be a string')
    const result = await productManager.deleteProductById(pid)
    if (!result) throw new Error('Product not found')
    if (result.deletedCount === 1) res.status(200).send({ status: 'success', message: `The product with id: ${pid} was deleted` })
    if (result.acknowledged && result.deletedCount === 0) res.status(202).send({ status: 'info', message: `doesnt exist product with id: ${pid}` })
    if (!result.acknowledged) throw Error('The data to perform the query is incorrect')
  } catch (error) {
    res.status(406).send({ status: 'error', message: error.message })
  }
}
