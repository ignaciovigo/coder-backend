import express from 'express'
import routerProducts from './routes/products.routes.js'
import routerCarts from './routes/carts.routes.js'
import routerViews from './routes/views.routes.js'
import { __dirname } from './utils.js'
import handlebars from 'express-handlebars'
import './db.js'
import SocketServer from './services/SocketServer.js'

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
// Socket Server
const io = new SocketServer(httpServer)
io.enableSockets()
