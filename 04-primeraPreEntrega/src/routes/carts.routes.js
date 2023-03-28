import { Router } from 'express'
import { cartManager } from '../services/CartsManager.js'

const router = Router()

router.post('/', (req, res) => {
  try {
    cartManager.createCart()
    res.send({ status: 'success', message: 'Cart created successfully' })
  } catch (err) {
    res.status(500).send({ status: 'error', message: err.message })
  }
})

router.get('/:cid', async (req, res) => {
  try {
    const cid = parseInt(req.params.cid)
    if (!cid) {
      return res.status(406).send({ status: 'error', message: 'The id provided is invalid' })
    }
    res.send(await cartManager.getCartById(cid))
  } catch (err) {
    res.status(500).send({ status: 'error', message: err.message })
  }
})

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)
    if (!cid || !pid) return res.send({ status: 'error', message: 'one or both given ids are invalid' })
    await cartManager.addProductToCartByIds(cid, pid)
    res.send({ status: 'success', message: `The product with id ${pid} was added to Cart with id ${cid} successfully` })
  } catch (err) {
    res.status(500).send({ status: 'error', message: err.message })
  }
})
export default router
