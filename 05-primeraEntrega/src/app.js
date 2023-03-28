import express from 'express'
import routerProducts from './routes/products.routes.js'
import routerCarts from './routes/carts.routes.js'
import routerViews from './routes/views.routes.js'
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import { productManager } from './services/ProductManager.js'

const app = express()
const PORT = 8080
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

// config handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
// endpoints
app.use('/api/products', routerProducts)
app.use('/api/carts', routerCarts)
app.use('/', routerViews)

const httpServer = app.listen(PORT, () => {
  console.log(`server running on port : ${PORT}`)
})
const io = new Server(httpServer)

io.on('connection', (socket) => {
  console.log('Client online')
  // getProducts
  socket.on('getProducts', async (data) => {
    try {
      const products = await productManager.getProducts()
      if (products.length === 0) throw new Error('Not products')
      io.emit('getProducts', { status: 'success', products })
    } catch (error) {
      io.emit('getProducts', { status: 'error', message: error.message })
    }
  })
  // AddProduct
  socket.on('addProduct', async (fieldsProduct) => {
    try {
      await productManager.addProduct(fieldsProduct)
      socket.emit('addProductMessage', {
        status: 'success',
        message: 'Product Added'
      })
    } catch (error) {
      socket.emit('addProductMessage', {
        status: 'error',
        message: error.message
      })
    }
  })

  // Delete product
  socket.on('deleteProductById', async (data) => {
    try {
      await productManager.deleteProductById(data)
      socket.emit('message', { status: 'success', message: 'Product Deleted' })
    } catch (error) {
      socket.emit('message', { status: 'error', message: error.message })
    }
  })
})
