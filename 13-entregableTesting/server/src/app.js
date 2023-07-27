import config from './config/config.js'
import express from 'express'
import compresssion from 'express-compression'
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
import { addLogger, customLogger } from './config/logger.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUIExpress from 'swagger-ui-express'
import cluster from 'cluster'
import { cpus } from 'os'
import { faker } from '@faker-js/faker'

if (cluster.isPrimary) {
  customLogger.info('Primary process, generating workers')
  for (let i = 0; i < cpus().length; i++) {
    cluster.fork()
  }
  cluster.on('exit', worker => {
    customLogger.error(`workeer ${worker.process.pid} has gone`)
    cluster.fork()
  })
} else {
  customLogger.info(`worker initialized id: ${process.pid}`)

  const app = express()
  // SETTINGS

  // swagger config
  const swaggerOpts = {
    definition: {
      openapi: '3.0.1',
      info: {
        title: 'API ShopFast Documentation',
        description: 'API Doc description'
      }
    },
    apis: ['./src/docs/**/*.yml']
  }
  const specs = swaggerJSDoc(swaggerOpts)
  app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs))
  // to json
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
  }))
  app.use(compresssion())
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
  // test endpoints
  app.get('/easyoperation', (req, res) => {
    let sum = 0
    for (let i = 0; i < 1000000; i++) {
      sum += i
    }
    res.send({ sum })
  })
  app.get('/hardoperation', (req, res) => {
    let sum = 0
    for (let i = 1; i < 5e8; i++) {
      sum += i
    }
    res.send({ sum })
  })

  app.get('/api/test/user', (req, res) => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.firstName()
    const email = faker.internet.email()
    const age = faker.number.int({ min: 18, max: 50 })
    const password = faker.internet.password()
    res.send({ firstName, lastName, email, age, password })
  })
  app.get('api/test/docker', (req, res) => {
    res.send('Nice to meet you Docker!')
  })
  // Running sv
  app.listen(config.PORT, () => {
    console.log(`server running on port : ${config.PORT}`)
  })
  // Data base connection
  ConnectionToMDB.getInstance()
}
