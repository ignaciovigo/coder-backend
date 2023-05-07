import { Router } from 'express'
import { cartManager } from '../services/CartManager.service.js'
import passport from 'passport'

const router = Router()

router.post('/register', (req, res, next) => {
  passport.authenticate('register', (err, user, info) => {
    if (err) return res.status(500).json({ message: 'Could not register' })
    if (!user) { return res.status(401).json({ message: 'The email is already in use' }) }
    res.status(201).send({
      status: 'success',
      message: 'The account has been registered',
      payload: req.session.user
    })
  })(req, res, next)
})

router.post('/login', (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) return res.status(500).json({ message: 'Authenticate Error' })
    if (!user) { return res.status(401).json({ message: 'Email or password is invalid' }) }
    req.logIn(user, async (err) => {
      if (err) return res.status(500).json({ message: 'Authenticate Error' })
      const { id } = await cartManager.createCart()
      req.session.user = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        cartId: id,
        role: user.role
      }
      res.status(201).send({
        status: 'success',
        message: 'Login successfuly',
        payload: req.session.user
      })
    })
  })(req, res, next)
})

router.get('/logout', async (req, res) => {
  try {
    req.session.destroy((error) => {
      if (error) throw new Error('Log out error')
      res
        .clearCookie('connect.sid')
        .send({ status: 'success', message: 'The session has been closed' })
    })
  } catch (error) {
    res.status(401).send({ status: 'error', message: error.message })
  }
})
// Git Hub login
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/user/login' }), async (req, res) => {
  try {
    const { id } = await cartManager.createCart()
    const user = req.user
    console.log(user)
    req.session.user = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      cartId: id,
      role: user.role
    }
    res.redirect('/products')
  } catch (error) {
    res.status(401).send({ status: 'error', message: error.message })
  }
})

export default router
