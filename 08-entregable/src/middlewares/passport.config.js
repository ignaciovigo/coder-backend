import passport from 'passport'
import local from 'passport-local'
import Github from 'passport-github2'
import userModel from '../models/users.model.js'
import { createHash, isValidPassword } from '../utils.js'

const LocalStrategy = local.Strategy
const initializePassport = () => {
  // register strategy
  passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
      const { firstName, lastName, email, age } = req.body
      if (!firstName || !lastName || !email || !age || !password) return done('Some fields are incomplete', false)
      try {
        const user = await userModel.findOne({ email: username })
        if (user) {
          return done(null, false)
        } else {
          const newUser = {
            firstName,
            lastName,
            email,
            age,
            password: createHash(password),
            role: (username === 'adminCoder@coder.com') ? 'Admin' : 'User'
          }
          const result = await userModel.create(newUser)
          if (!result) return done('Could not register the user', false)
          return done(null, result)
        }
      } catch (error) {
        return done(`Error in the registration process: ${error} ${error.message}`)
      }
    }))

  // login local strategy
  passport.use('login', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
      try {
        const user = await userModel.findOne({ email: username })
        if (!user || !isValidPassword(user, password)) return done(null, false, { message: 'The email or password is invalid.' })
        return done(null, user)
      } catch (error) {
        return done(`Error in the login process: ${error}`)
      }
    }))

  // login gitHub strategy
  passport.use('github', new Github(
    {
      clientID: process.env.CLIENT_ID_GITHUB,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile._json.email) return done(null, false)
        const user = await userModel.findOne({ email: profile._json.email })
        if (!user) {
          const newUser = {
            firstName: profile.username,
            lastName: '',
            email: profile._json.email,
            age: undefined,
            password: '',
            role: (profile._json.email === 'adminCoder@coder.com') ? 'Admin' : 'User'
          }
          const result = await userModel.create(newUser)
          if (!result) return done('Could not access with github account', false)
          return done(null, result)
        } else {
          return done(null, user)
        }
      } catch (error) {
        return done(error)
      }
    }
  ))
}

passport.serializeUser((user, done) => {
  done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id)
    done(null, user)
  } catch (error) {
    console.log(`Deserialize user error: ${error}`)
  }
})

export default initializePassport
