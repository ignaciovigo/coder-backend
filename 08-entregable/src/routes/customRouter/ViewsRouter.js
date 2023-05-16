import { cartManager } from '../../services/CartManager.service.js'
import { productManager } from '../../services/ProductManager.service.js'
import { getLink } from '../../utils.js'
import CustomRouter from './CustomRouter.js'

export default class ViewsRouter extends CustomRouter {
  init () {
    // products
    this.get('/products', { policies: ['ADMIN', 'USER'], strategy: 'jwt' }, async (req, res) => {
      try {
        const { limit, page, sort, query } = req.query
        if (limit && isNaN(Number(limit))) return res.sendUserError('The param limit given must be a number')
        if (page && isNaN(Number(page))) return res.sendUserError('The param page given must be a number')
        if (sort && sort !== 'asc' && sort !== 'desc') return res.sendUserError('The param sort given must be a value "asc" or "desc" ')
        const result = await productManager.getProducts({
          limit,
          page,
          sort,
          query
        })
        // Adding properties nextLink and prevLink to result
        const { prevLink, nextLink } = getLink(req, result)
        // Excluding some properties of the result
        const { docs, totalDocs, pagingCounter, ...resp } = result
        const resultFormatted = {
          status: 'success',
          payload: docs,
          ...resp,
          prevLink,
          nextLink,
          ...req.user
        }
        return res.render('products', {
          ...resultFormatted,
          style: '/css/index.css',
          scriptPath: '/js/products.js',
          scriptPath2: '/js/logout.js'
        })
      } catch (error) {
        return res.sendServerError(error.message)
      }
    })

    // cart
    this.get('/carts/:cid', { policies: ['ADMIN', 'USER'], strategy: 'jwt' }, async (req, res) => {
      try {
        const { cid } = req.params
        if (typeof cid !== 'string') return res.sendUserError('The id cart is invalid')
        if (!cid) {
          return res.sendUserError('The id provided is invalid')
        }
        const cart = await cartManager.getCartById(cid)
        console.log(cart.products)
        if (!cart) return res.sendUserError('Cart not found')
        const totalPrice = cart.products
          .reduce((acc, e) => acc + e.quantity * e.product.price, 0)
          .toFixed(2)
        return res.render('cart', {
          style: '/css/index.css',
          products: cart.products,
          totalPrice,
          scriptPath: '/js/cart.js',
          scriptPath2: '/js/logout.js',
          cartId: cid
        })
      } catch (error) {
        return res.sendServerError(error.message)
      }
    })

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
