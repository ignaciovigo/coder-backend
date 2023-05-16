import { Router } from 'express'
import passport from 'passport'

export default class CustomRouter {
  constructor () {
    this.router = Router() // creates an instance of Express's Router in the prop router
    this.init() // executes the method init which can be defined to set routes and middlewares.
  }

  getRouter () { // this method returns the instance of Express Router
    return this.router
  }

  init () {} // is an entry point that will be for their inherited classes

  get (path, { policies, strategy, options }, ...callbacks) { // defines a GET route in the router
    /*
        path ==  (endpoint),
        object == policies, passport strategy, passport options
        callbacks == It takes one or more callbacks arguments,
         which are controller functions to be executed when the specified path is accessed.
    */
    this.router.get(path, this.handlePolicies({ policies, strategy, options }), this.generateCustomResponses, this.applyCallbacks(callbacks)) //
    // this router.get is executing the get Express router method.
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
    /*
        takes the callbacks and wraps them in asynchronous functions that catch
        any errors and return an error reponse if any exceptions occur.
    */
    return callbacks.map((callback) => async (...params) => {
      /* the params are req,res,next */
      try {
        await callback.apply(this, params)
        // execute the callback and  apply() is used to make sure that the context
        //  (this) is kept in the instance of the customRouter class.
      } catch (error) {
        console.log(error)
        // params[1] to refers the second element of params which is the response object
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
      // the auth is required
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
