import ProductManagerRepository from './ProductManager.repository.js'
import CartManagerRepository from './CartManager.repository.js'
import CartManagerMongo from '../dao/mongodb/CartManagerMongo.js'
import ProductManagerMongo from '../dao/mongodb/ProductManagerMongo.js'
import UserManagerMongo from '../dao/mongodb/UserManagerMongo.js'
import UserManagerRepository from './UserManagerRepository.js'
import TicketManagerRepository from './TicketManager.repository.js'
import TicketManagerMongo from '../dao/mongodb/TicketManagerMongo.js'

export const cartService = new CartManagerRepository(new CartManagerMongo())
export const productService = new ProductManagerRepository(new ProductManagerMongo())
export const userService = new UserManagerRepository(new UserManagerMongo())
export const ticketService = new TicketManagerRepository(new TicketManagerMongo())
