import CustomRouter from './CustomRouter.js'
import { getUserData, registerUser, getTickets } from '../../controllers/users.controller.js'

export default class UsersRouter extends CustomRouter {
  init () {
    // Here define the initialization of our routes
    this.post('/register', { policies: ['PUBLIC'] }, registerUser)
    this.get('/data', { policies: ['USER', 'ADMIN'], strategy: 'jwt' }, getUserData)
    this.get('/tickets', { policies: ['USER'], strategy: 'jwt' }, getTickets)
  }
}
