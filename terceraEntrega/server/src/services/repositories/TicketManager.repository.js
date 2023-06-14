
export default class TicketManagerRepository {
  constructor (dao) {
    this.dao = dao
  }

  async generate ({ email, amount, products }) {
    const ticket = await this.dao.generate({ email, amount, products })
    return ticket
  }

  async getById ({ ticketId }) {
    const ticket = await this.dao.getById({ ticketId })
    return ticket
  }

  async getTickets ({ email }) {
    const ticket = await this.dao.getTickets({ email })
    return ticket
  }
}
