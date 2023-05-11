import passport from 'passport'

// checks if there is an active session
export function redirectLoggedIn (req, res, next) {
  if (req.session.user) {
    return res.redirect('/products')
  }
  next()
}

export function redirectNotUser (req, res, next) {
  if (!req.session.user) {
    return res.redirect('/user/login')
  }
  next()
}

// middleware to handle the passport strategy errors once they've already been implemented in the router
export function passportStrategy (strategy, options) {
  return async (req, res, next) => {
    passport.authenticate(strategy, options ?? { session: false }, function (err, user, info) {
      console.log(user)
      if (err) return next(err)
      if (!user) {
        const message = info && typeof info === 'object' ? info.toString() : 'Unauthorized'
        return res.status(401).send({ status: 'info', message })
      }
      req.user = user
      next()
    })(req, res, next)
  }
}

// middleware to concede permissions based on user role

export function authByRole (role) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({
        status: 'info',
        message: 'Unauthorized: user not found in jwt'
      })
    }
    if (!role.includes(req.user.role)) {
      return res.status(403).send({ status: 'info', message: 'Cannot access due to your role' })
    }
    next()
  }
}
