import config from './config/config.js'
import express from 'express'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import { __dirname } from './utils.js'
import initializePassport from './middlewares/passport.config.js'
import UsersRouter from './routes/customRouter/UsersRouter.js'
import JwtRouter from './routes/customRouter/JwtRouter.js'
import ProductsRouter from './routes/customRouter/ProductsRouter.js'
import CartsRouter from './routes/customRouter/CartsRouter.js'
import ConnectionToMDB from './db.js'
import cors from 'cors'
import MocksRouter from './routes/customRouter/MocksRouter.js'
import { addLogger } from './config/logger.js'

const app = express()
// SETTINGS
// to json
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true
}))
// to cookies
app.use(cookieParser(config.SECRET_COOKIE))
// middleware to loggers
app.use(addLogger)
// to passport
initializePassport()
app.use(passport.initialize())

// to managment static files
app.use(express.static(__dirname + '/public'))

// instance of custom router
const initUserRouter = new UsersRouter()
const initProductsRouter = new ProductsRouter()
const initJwtRouter = new JwtRouter()
const initCartsRouter = new CartsRouter()
const initMocksRouter = new MocksRouter()
// to endpoints
app.use('/api/users', initUserRouter.getRouter())
app.use('/api/jwt', initJwtRouter.getRouter())
app.use('/api/products', initProductsRouter.getRouter())
app.use('/api/carts', initCartsRouter.getRouter())
app.use('/mockingproducts', initMocksRouter.getRouter())
app.get('/loggerTest', (req, res) => {
  req.logger.debug('This is a debug logger')
  req.logger.http('This is a http logger')
  req.logger.info('This is a info logger')
  req.logger.warning('This is a warning logger')
  req.logger.error('This is a error logger')
  req.logger.fatal('This is a fatal logger')

  res.send('This is a logger test')
})
// Running sv
app.listen(config.PORT, () => {
  console.log(`server running on port : ${config.PORT}`)
})
// Data base connection
ConnectionToMDB.getInstance()
