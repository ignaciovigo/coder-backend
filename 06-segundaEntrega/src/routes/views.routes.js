import { Router } from 'express'
import { productManager } from '../services/ProductManager.js'

const router = Router()

router.get('/', async (req, res) => {
  const arrProducts = await productManager.getProducts()
  res.render('home', { arrProducts, style: '/css/index.css' })
})

router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts', { scriptPath: '/js/index.js', style: '/css/index.css' })
})
export default router
