import { renderCartById } from '../../controllers/carts.controller.js'
import { renderProducts } from '../../controllers/products.controller.js'
import CustomRouter from './CustomRouter.js'

export default class ViewsRouter extends CustomRouter {
  init () {
    // products
    this.get('/products', { policies: ['ADMIN', 'USER'], strategy: 'jwt' }, renderProducts)

    // cart
    this.get('/carts/:cid', { policies: ['ADMIN', 'USER'], strategy: 'jwt' }, renderCartById)

    // user
    this.get('/', { policies: ['PUBLIC'] }, async (req, res) => {
      return res.redirect('/user/login')
    })

    this.get('/user/login', { policies: ['PUBLIC'] }, async (req, res) => {
      return res.render('login', { scriptPath: '/js/login.js' })
    })

    this.get('/user/register', { policies: ['PUBLIC'] }, async (req, res) => {
      return res.render('register', { scriptPath: '/js/register.js' })
    })

    this.get('/user/profile', { policies: ['ADMIN', 'USER'], strategy: 'jwt' }, async (req, res) => {
      console.log('from profile. ', req.user)
      return res.render('profile', { ...req.user, scriptPath2: '/js/logout.js' })
    })

  // router.get('/realtimeproducts', async (req, res) => {
  //   res.render('realTimeProducts', { scriptPath: '/js/index.js', style: '/css/index.css' })
  // })
  }
}
