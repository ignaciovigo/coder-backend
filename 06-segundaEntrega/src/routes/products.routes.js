import { Router } from 'express'
import { productManager } from '../services/ProductManager.js'

const router = Router()

router.get('/', async (req, res) => {
  const productsArr = await productManager.getProducts()
  const limit = parseInt(req.query.limit)
  if (limit) {
    const productsWithLimit = productsArr.slice(0, limit)
    res.send(productsWithLimit)
  } else {
    res.send(productsArr)
  }
})

router.get('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid)
    if (!pid) throw new Error('The id provided is incorrect')
    res.send(await productManager.getProductById(pid))
  } catch (err) {
    res.status(406).send({ status: 'error', message: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const newProduct = req.body
    await productManager.addProduct(newProduct)
    res.send({ status: 'success', message: `Product added with id ${newProduct.id}` })
  } catch (err) {
    console.log(err)
    res.status(406).send({ status: 'error', message: err.message })
  }
})

router.put('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid)
    const productUpdates = req.body
    if (!pid) throw new Error('The id provided is incorrect')
    await productManager.updateProduct(pid, productUpdates)
    res.send({ status: 'success', message: `product with id ${pid} updated` })
  } catch (err) {
    res.status(406).send({ status: 'error', message: err.message })
  }
})

router.delete('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid)
    if (!pid) throw new Error('The id provided is incorrect')
    await productManager.deleteProductById(pid)
    res.send({ status: 'success', message: `Product with id ${pid} has been deleted` })
  } catch (err) {
    res.status(406).send({ status: 'error', message: err.message })
  }
})

export default router
