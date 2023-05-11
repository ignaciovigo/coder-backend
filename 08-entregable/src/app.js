import express from 'express'
import session from 'express-session'
import './db.js'
import handlebars from 'express-handlebars'
import cookieParser from 'cookie-parser'
import passport from 'passport'
import jwtRouter from './routes/jwt.routes.js'
import usersRouter from './routes/users.routes.js'
import routerProducts from './routes/products.routes.js'
import routerCarts from './routes/carts.routes.js'
import routerViews from './routes/views.routes.js'
import { __dirname } from './utils.js'
import initializePassport from './middlewares/passport.config.js'
// import SocketServer from './services/SocketServer.js'

const app = express()
const PORT = 8080
// SETTINGS
// to json
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// to cookies
app.use(cookieParser())

// to sessions
app.use(session({
  secret: 'xlrstats101',
  resave: false,
  saveUninitialized: true
}))

// to passport
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// to managment static files
app.use(express.static(__dirname + '/public'))

// to handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// to endpoints
app.use('/api/products', routerProducts)
app.use('/api/users', usersRouter)
app.use('/api/carts', routerCarts)
app.use('/api/jwt', jwtRouter)
app.use('/', routerViews)

// Running sv
app.listen(PORT, () => {
  console.log(`server running on port : ${PORT}`)
})

// const httpServer = app.listen(PORT, () => {
//   console.log(`server running on port : ${PORT}`)
// })
// Socket Server
// const io = new SocketServer(httpServer)
// io.enableSockets()
