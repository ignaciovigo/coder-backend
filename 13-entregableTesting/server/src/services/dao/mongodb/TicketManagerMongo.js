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

  async getTickets ({ email, page = 1}) {
    try {
      const result = await ticketModel.paginate({ email }, { limit: 5, page, lean: true, populate: 'products.product', sort: { time: -1 } })
      return result
    } catch (error) {
      throw Error(error.message)
    }
  }
}
