import passport from 'passport'
import Github from 'passport-github2'
import jwtStrategy from 'passport-jwt'
import config from '../config/config.js'
import { userService } from '../services/repositories/index.js'
// function to extract the token from the http request and decoded it
const ExtractJWT = jwtStrategy.ExtractJwt

const initializePassport = () => {
  // auth jwt strategy
  passport.use('jwt', new jwtStrategy.Strategy({
    jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: config.PRIVATE_KEY
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
      clientID: config.CLIENT_ID_GITHUB,
      clientSecret: config.CLIENT_SECRET,
      callbackURL: config.CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        if (!profile._json.email) return done('Make sure that the email in your GitHub accoun must be in public access', false)
        const user = await userService.getByEmail({ email: profile._json.email })
        // checks if the user exists with the email received from github account
        if (user) {
          // checks if the user has github Id
          if (user.githubId) {
            console.log('The user has GHID', user)
            return done(null, user)
          } else {
            // if the user has already registered before and is joinning for the first time with github
            const userUpdated = await userService.updateUser({ email: profile._json.email, updates: { githubId: profile.id } })
            console.log(`User already registered before ${userUpdated}`)
            return done(null, userUpdated)
          }
        } else {
          // if the user has no account
          const newUser = {
            firstName: profile.name,
            username: profile.username,
            lastName: undefined,
            email: profile._json.email,
            age: undefined,
            githubId: profile.id
          }
          const result = await userService.register(newUser)
          if (!result) return done('Could not access with github account', false)
          console.log('No tiene ninguna cuenta de nada y con git', result)
          return done(null, result)
        }
      } catch (error) {
        console.log(error, error.message)
        return done(error)
      }
    }
  ))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userService.getById(id)
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
