import { Server } from 'socket.io'
import { productManager } from './ProductManager.service.js'

export default class SocketServer {
  static #socketServerUnique

  constructor (httpServer) {
    if (!SocketServer.#socketServerUnique) {
      SocketServer.#socketServerUnique = new Server(httpServer)
    }
  }

  enableSockets () {
    SocketServer.#socketServerUnique.on('connection', (socket) => {
      console.log('Client online connected')
      // getProducts
      socket.on('getProducts', async (data) => {
        try {
          const products = await productManager.getProducts()
          if (products.length === 0) throw new Error('Not products')
          SocketServer.#socketServerUnique.emit('getProducts', { status: 'success', products })
        } catch (error) {
          SocketServer.#socketServerUnique.emit('getProducts', { status: 'error', message: error.message })
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
  }
}
