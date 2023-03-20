import express from 'express'
import routerProducts from './routes/products.routes.js'
import routerCarts from './routes/carts.routes.js'

const app = express()
const PORT = 8080
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', routerProducts)
app.use('/api/carts', routerCarts)

app.listen(PORT, () => {
  console.log(`server running on port : ${PORT}`)
})
