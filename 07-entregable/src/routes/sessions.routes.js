import { Router } from 'express'
import userModel from '../models/users.model.js'
import { cartManager } from '../services/CartManager.service.js'
const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, age, password } = req.body
    if (!firstName || !lastName || !email || !age || !password) throw new Error('Some fields are incomplete')
    const exists = await userModel.exists({ email })
    if (exists) throw new Error('The user already exists')
    const user = {
      firstName,
      lastName,
      email,
      age,
      password
    }
    const result = await userModel.create(user)
    res
      .status(201)
      .send({
        status: 'success',
        message: `User created with id ${result.id}`
      })
  } catch (error) {
    res.status(401).send({ status: 'error', message: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    // the pass actually must be encrypted. but we make this way for the moment
    const user = await userModel.findOne({ email, password })
    if (!user) throw new Error('Credentials errors')
    const { id } = await cartManager.createCart()
    console.log('session logged')
    // assign data for the session.
    req.session.user = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      cartId: id
    }
    console.log(user)
    res
      .status(201)
      .send({
        status: 'success',
        message: 'Login successfuly',
        payload: req.session.user
      })
  } catch (error) {
    res.status(401).send({ status: 'error', message: error.message })
  }
})

router.get('/logout', async (req, res) => {
  try {
    req.session.destroy(error => {
      if (error) throw new Error('Log out error')
      res.clearCookie('connect.sid').send({ status: 'success', message: 'The session has been closed' })
    })
  } catch (error) {
    res.status(401).send({ status: 'error', message: error.message })
  }
})

export default router
