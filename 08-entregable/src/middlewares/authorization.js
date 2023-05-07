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
