import config from './config/config.js'
import express from 'express'
import handlebars from 'express-handlebars'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { __dirname } from './utils.js'
import initializePassport from './middlewares/passport.config.js'
import UsersRouter from './routes/customRouter/UsersRouter.js'
import JwtRouter from './routes/customRouter/JwtRouter.js'
import ProductsRouter from './routes/customRouter/ProductsRouter.js'
import CartsRouter from './routes/customRouter/CartsRouter.js'
import ViewsRouter from './routes/customRouter/ViewsRouter.js'
import { ConnectionToMDB } from './db.js'
// import SocketServer from './services/SocketServer.js'

const app = express()
// SETTINGS
// to json
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// to cookies
app.use(cookieParser(config.SECRET_COOKIE))

// to sessions

// to passport
initializePassport()
app.use(passport.initialize())

// to managment static files
app.use(express.static(__dirname + '/public'))

// to handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
// instance of custom router
const initUserRouter = new UsersRouter()
const initProductsRouter = new ProductsRouter()
const initJwtRouter = new JwtRouter()
const initCartsRouter = new CartsRouter()
const initViewsRouter = new ViewsRouter()
// to endpoints
app.use('/api/users', initUserRouter.getRouter())
app.use('/api/jwt', initJwtRouter.getRouter())
app.use('/api/products', initProductsRouter.getRouter())
app.use('/api/carts', initCartsRouter.getRouter())
app.use('/', initViewsRouter.getRouter())

// Running sv
app.listen(config.PORT, () => {
  console.log(`server running on port : ${config.PORT}`)
})
// Data base connection
const connectDB = async () => {
  await ConnectionToMDB.getInstance()
}
connectDB()

// const httpServer = app.listen(PORT, () => {
//   console.log(`server running on port : ${PORT}`)
// })
// Socket Server
// const io = new SocketServer(httpServer)
// io.enableSockets()
