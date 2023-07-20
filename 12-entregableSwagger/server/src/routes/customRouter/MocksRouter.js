import { generateProducts } from '../../utils.js'
import CustomRouter from './CustomRouter.js'

export default class MocksRouter extends CustomRouter {
  init () {
    this.get('/', { policies: ['PUBLIC'] }, async (req, res) => {
      return res.sendSuccess(generateProducts({ numOfProducts: 50 }))
    })
  }
}
