import dotenv from 'dotenv'
import command from '../process.js'

const environment = command.opts().Mode
console.log(`mode: ${environment}`)
dotenv.config({
  path: environment === 'production' ? './src/config/.env.production' : './src/config/.env.development'

})

export default {
  MONGO_URL: process.env.MONGO_URL,
  CLIENT_ID_GITHUB: process.env.CLIENT_ID_GITHUB,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  CALLBACK_URL: process.env.CALLBACK_URL,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  SECRET_COOKIE: process.env.SECRET_COOKIE,
  PORT: process.env.PORT,
  URL_REACT_APP: process.env.URL_REACT_APP,
  NODEMAILER: process.env.NODEMAILER,
  EMAIL: process.env.EMAIL,
  environment
}
