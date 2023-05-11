import { Router } from 'express'
import { generateToken, isValidPassword } from '../utils.js'
import userModel from '../models/users.model.js'
import { cartManager } from '../services/CartManager.service.js'
import { passportStrategy } from '../middlewares/authorization.js'

const router = Router()

router.post('/login', async (req, res) => {
  const email = req.body.email
  const pwd = req.body.password
  try {
    // check if the email exists in the db
    const userFromDB = await userModel.findOne({ email })
    if (!userFromDB) return res.status(400).send({ status: 'info', message: 'Credentials Error' })
    if (!userFromDB.password) return res.status(401).send({ status: 'info', message: 'You cant access may be you have already registered with GitHub Account'})
    // if the password received is wrong
    if (!isValidPassword(userFromDB, pwd)) return res.status(400).send({ status: 'info', message: 'Credentials Error' })
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
    }).send({ stauts: 'success', message: 'Login successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).send({ status: 'error', message: 'Internal server error' })
  }
})
// GitHub login with jwt
router.get('/github', passportStrategy('github', { scope: ['user:email'] }))

router.get('/githubcallback', passportStrategy('github', { failureRedirect: '/user/login' }), async (req, res) => {
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
    res.status(401).send({ status: 'error', message: error.message })
  }
})

router.get('/logout', async (req, res) => {
  try {
    req.session.destroy((error) => {
      if (error) throw new Error('Log out error')
      res
        .clearCookie('jwtCookie')
        .send({ status: 'success', message: 'The session has been closed' })
    })
  } catch (error) {
    res.status(401).send({ status: 'error', message: error.message })
  }
})

export default router
