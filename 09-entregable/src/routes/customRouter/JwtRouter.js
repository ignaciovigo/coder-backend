import userModel from '../../models/users.model.js'
import { cartManager } from '../../services/CartManager.service.js'
import { generateToken, isValidPassword } from '../../utils.js'
import CustomRouter from './CustomRouter.js'

export default class JwtRouter extends CustomRouter {
  init () {
    this.post('/login', { policies: ['PUBLIC'] }, async (req, res) => {
      const email = req.body.email
      const pwd = req.body.password
      try {
        // check if the email exists in the db
        const userFromDB = await userModel.findOne({ email })
        if (!userFromDB) return res.sendUserError('Credentials Error')
        if (!userFromDB.password) return res.sendUserError('You cant access may be you have already registered with GitHub Account')
        // if the password received is wrong
        if (!isValidPassword(userFromDB, pwd)) return res.sendUserError('Credentials Error')
        // finally I create an object without sensitive user data
        const { id } = await cartManager.createCart()
        const { firstName, lastName, age, role } = userFromDB
        const userToken = {
          firstName,
          lastName,
          age,
          role,
          email: userFromDB.email,
          cartId: id
        }
        console.log('Token generate from api/jwt/login')
        const accessToken = generateToken(userToken)
        // now save the token generated in a cookie
        res.cookie('jwtCookie', accessToken, {
          maxAge: 3600000,
          httpOnly: true
        }).sendSuccess('Login successfully')
      } catch (error) {
        console.error(error)
        return res.sendServerError('Internal server error')
      }
    })

    this.get('/logout', { policies: ['USER', 'ADMIN'], strategy: 'jwt' }, async (req, res) => {
      try {
        res
          .clearCookie('jwtCookie')
          .sendSuccess('The session has been closed')
      } catch (error) {
        res.sendServerError(error.message)
      }
    })

    this.get('/github', { policies: ['PUBLIC'], strategy: 'github', options: { scope: ['user:email'] } })

    this.get('/githubcallback', { policies: ['PUBLIC', 'USER', 'ADMIN'], strategy: 'github', options: { failureRedirect: '/user/login' } }, async (req, res) => {
      try {
        const { id } = await cartManager.createCart()
        req.user.cartId = id
        console.log('req user from callback git', req.user)
        const accessToken = generateToken(req.user)
        res.cookie('jwtCookie', accessToken, {
          maxAge: 3600000,
          httpOnly: true
        }).redirect('/products')
      } catch (error) {
        res.sendServerError(error.message)
      }
    })
  }
}
