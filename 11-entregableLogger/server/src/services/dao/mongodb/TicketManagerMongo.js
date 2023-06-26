import ticketModel from '../../../models/ticket.model.js'
import crypto from 'crypto'

export default class TicketManagerMongo {
  static #instance
  constructor () {
    if (!TicketManagerMongo.#instance) {
      TicketManagerMongo.#instance = this
      return
    }
    return TicketManagerMongo.#instance
  }

  async generate ({ email, amount, products }) {
    try {
      const code = crypto.randomUUID().slice(-12)
      const ticket = await ticketModel.create({ email, code, amount, products })
      return ticket
    } catch (error) {
      throw Error(error.message)
    }
  }

  async getById ({ ticketId }) {
    try {
      const ticket = await ticketModel.findOne({ _id: ticketId }).lean()
      return ticket
    } catch (error) {
      throw Error(error.message)
    }
  }

  async getTickets ({ email }) {
    try {
      const ticket = await ticketModel.find({ email }, { products: 1, time: 1, amount: 1 }).populate('products.product').sort({ time: -1 }).lean()
      return ticket
    } catch (error) {
      throw Error(error.message)
    }
  }
}
