import passport from 'passport'
import Github from 'passport-github2'
import userModel from '../models/users.model.js'
import jwtStrategy from 'passport-jwt'
import { createHash, randomString } from '../utils.js'
// function to extract the token from the http request and decoded it
const ExtractJWT = jwtStrategy.ExtractJwt

const initializePassport = () => {
  // auth jwt strategy
  passport.use('jwt', new jwtStrategy.Strategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.PRIVATE_KEY
  },
  async (payload, done) => {
    try {
      console.log('Token has been received and decoded from passport jwt')
      return done(null, payload)
    } catch (error) {
      console.error(`Error strategy jwt, ${error}`)
      return done(`Error ${error.message}`)
    }
  })
  )
  // login gitHub strategy
  passport.use('github', new Github(
    {
      clientID: process.env.CLIENT_ID_GITHUB,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile._json.email) return done('Make sure that the email in your GitHub accoun must be in public access', false)
        const user = await userModel.findOne({ email: profile._json.email })
        // checks if the user exists with the email received from github account
        if (user) {
          // checks if the user has github Id
          if (user.githubId) {
            return done(null, { firstName: user.firstName, email: user.email, role: user.role, age: user.age, lastName: user.lastName })
          } else {
            // if the user has already registered before but its joinning for the first time with github
            const userUpdated = await userModel.findOneAndUpdate({ email: profile._json.email }, { githubId: profile.id }, { new: true })
            return done(null, { firstName: userUpdated.firstName, email: userUpdated.email, role: userUpdated.role, age: userUpdated.age, lastName: userUpdated.lastName })
          }
        } else {
          // if the user doesnt have any type of account
          const newUser = {
            firstName: profile.username,
            lastName: undefined,
            email: profile._json.email,
            age: undefined,
            githubId: profile.id,
            role: (profile._json.email === 'adminCoder@coder.com') ? 'Admin' : 'User',
            password: createHash(randomString(12))
          }
          const result = await userModel.create(newUser)
          if (!result) return done('Could not access with github account', false)
          return done(null, { firstName: result.firstName, email: result.email, role: result.role, age: result.age, lastName: result.lastName })
        }
      } catch (error) {
        return done(error)
      }
    }
  ))

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
}

function cookieExtractor (req) {
  let token = null
  if (req && req.cookies) {
    console.log('Cookies exists in the req cookie!')
    token = req.cookies.jwtCookie
  }
  return token
}

export default initializePassport
