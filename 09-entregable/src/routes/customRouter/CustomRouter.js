import { Router } from 'express'
import passport from 'passport'

export default class CustomRouter {
  constructor () {
    this.router = Router()
    this.init()
  }

  getRouter () {
    return this.router
  }

  init () {}

  get (path, { policies, strategy, options }, ...callbacks) {
    this.router.get(path, this.handlePolicies({ policies, strategy, options }), this.generateCustomResponses, this.applyCallbacks(callbacks)) //
  }

  post (path, { policies, strategy, options }, ...callbacks) {
    this.router.post(path, this.handlePolicies({ policies, strategy, options }), this.generateCustomResponses, this.applyCallbacks(callbacks))
  }

  put (path, { policies, strategy, options }, ...callbacks) {
    this.router.put(path, this.handlePolicies({ policies, strategy, options }), this.generateCustomResponses, this.applyCallbacks(callbacks))
  }

  delete (path, { policies, strategy, options }, ...callbacks) {
    this.router.delete(path, this.handlePolicies({ policies, strategy, options }), this.generateCustomResponses, this.applyCallbacks(callbacks))
  }

  applyCallbacks (callbacks) {
    return callbacks.map((callback) => async (...params) => {
      try {
        await callback.apply(this, params)
      } catch (error) {
        console.log(error)
        params[1].status(500).send(error)
      }
    })
  }

  generateCustomResponses (req, res, next) {
    res.sendSuccess = payload => res.send({ status: 'success', payload })
    res.sendSuccessInfo = message => res.send({ status: 'success', message })
    res.sendServerError = error => res.status(500).send({ status: 'error', message: error })
    res.sendUserError = error => res.status(400).send({ status: 'error', message: error })
    next()
  }

  handlePolicies ({ policies, strategy, options }) {
    return (req, res, next) => {
      // when the endpoint doesnt require auth
      if (policies.includes('PUBLIC') && !strategy) {
        return next() // anyone can access
      }
      // when the endpoint requires auth
      passport.authenticate(strategy, options ?? { session: false }, function (err, user, info) {
        console.log(user)
        if (err) return next(err)
        if (!user) {
          const message = info && typeof info === 'object' ? info.toString() : 'Unauthorized'
          return res.status(401).send({ status: 'error', message })
        }
        if (!policies.includes(user.role)) return res.status(403).send({ status: 'error', message: 'Unauthorized user' })
        req.user = user
        return next()
      })(req, res, next)
    }
  }
}
