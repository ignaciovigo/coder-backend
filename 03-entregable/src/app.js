import express from 'express'
import ProductManager from './ProductManager.js'

const PORT = 8080
const app = express()
const instance1 = new ProductManager()

app.use(express.urlencoded({ extended: true }))
app.get('/products', async (req, res) => {
  const { limit } = req.query
  const productsArr = await instance1.getProducts()
  if (limit) {
    const productsWithLimit = { ...productsArr.slice(0, limit) }
    res.send(productsWithLimit)
  } else {
    res.send({ ...productsArr })
  }
})

app.get('/products/:pid', async (req, res) => {
  const { pid } = req.params
  try {
    if (pid) {
      res.send(await instance1.getProductById(pid))
    }
  } catch (e) {
    res.send({ error: e.message })
  }
})

app.listen(PORT, () => {
  console.log('listening..')
})
