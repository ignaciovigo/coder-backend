import { cartService, userService } from '../services/repositories/index.js'
import { generateToken, isValidPassword } from '../utils.js'

export async function loginUser (req, res) {
  const email = req.body.email
  const pwd = req.body.password
  if (!email) req.sendUserError('You must Provide an email')
  if (!pwd) req.sendUserError('You must provide a password')
  try {
    // check if the email exists in the db
    const userFromDB = await userService.getByEmail({ email, sensitive: true })
    if (!userFromDB) return res.sendUserError('Credentials Error')
    if (!userFromDB.password) {
      return res.sendUserError(
        'You cant access may be you have already registered with GitHub Account'
      )
    }
    // if the password received is wrong
    if (!isValidPassword(userFromDB, pwd)) { return res.sendUserError('Credentials Error') }
    // finally I create an object without sensitive user data
    const { password, ...userToken } = userFromDB
    req.logger.info(`Token generate from ${req.url}`)
    const accessToken = generateToken(userToken)
    // now save the token generated in a cookie
    res
      .cookie('jwtCookie', accessToken, {
        maxAge: 3600000,
        httpOnly: true
      })
      .sendSuccessInfo('Login successfully')
  } catch (error) {
    req.logger.error(`Login user failed reason: ${error.message}`)
    return res.sendServerError('Internal server error')
  }
}

export async function logoutUser (req, res) {
  try {
    res.clearCookie('jwtCookie').sendSuccess('The session has been closed')
  } catch (error) {
    res.sendServerError(error.message)
  }
}

export async function loginWithGitHub (req, res) {
  try {
    const { id } = await cartService.createCart()
    req.user.cartId = id
    req.logger.info('req user from callback git', req.user)
    const accessToken = generateToken(req.user)
    res.cookie('jwtCookie', accessToken, {
      maxAge: 3600000,
      httpOnly: true
    }).redirect('/products')
  } catch (error) {
    res.sendServerError(error.message)
  }
}
