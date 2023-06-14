import { cartService, ticketService, userService } from '../services/repositories/index.js'
import { formatDate } from '../utils.js'

export async function registerUser (req, res) {
  const { firstName, lastName, email, age, password } = req.body
  if (!firstName || !lastName || !email || !age || !password) {
    return res.sendUserError('The fields provided are incompleted')
  }
  try {
    const user = await userService.getByEmail({ email })
    if (user) {
      return res.sendUserError('The email is already in use')
    } else {
      const { id } = await cartService.createCart()
      const result = await userService.register({ firstName, lastName, email, age, password, cartId: id })
      console.log('regiser ', result)
      if (!result) throw Error('Error during registering user to the database')
      return res.sendSuccessInfo('User created successfully!')
    }
  } catch (error) {
    console.error(error)
    return res.sendServerError(`Could not register the user: ${error.message} `)
  }
}

export async function getUserData (req, res) {
  try {
    return res.sendSuccess(req.user)
  } catch (error) {
    return res.sendServerError(`Could not get the user data ${error}`)
  }
}

export async function getTickets (req, res) {
  try {
    const result = await ticketService.getTickets({ email: req.user.email })
    if (!result) throw result
    console.log(result)
    const tickets = result.map((ticket) => {
      const products = ticket.products?.map(e => (`${e.product?.title} x ${e.quantity}`)).join(', ')
      return { time: formatDate(ticket.time), amount: ticket.amount, products }
    })
    console.log(tickets)
    return res.sendSuccess(tickets)
  } catch (error) {
    console.log(error, error.message)
    return res.sendServerError(`Could not get the data from de tickets ${error}`)
  }
}
