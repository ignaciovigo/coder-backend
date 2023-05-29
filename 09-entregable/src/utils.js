import { fileURLToPath } from 'url'
import { dirname } from 'path'
import brcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import config from './config/config.js'
const fileName = fileURLToPath(import.meta.url)
const __dirname = dirname(fileName)

const patterns = {
  title: /^([a-zA-ZáÁéÉíÍóÓúÚñÑÜü]([0-9\s]+)?)+$/,
  description: /^[a-zA-ZáÁéÉíÍóÓúÚñÑÜü].+$/,
  price: /^(0|[1-9]\d*)(\.\d+)?$/,
  stock: /^[0-9]+$/,
  urlsImages: /^(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))$/,
  firstName: /^[A-Za-z]+$/,
  lastName: /^[A-Za-z]+(?:\s+[A-Za-z]+)*$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
}

function getLink (req, result) {
  let link = req.protocol + '://' + req.get('host') + req.originalUrl
  const indexOfString = link.indexOf('products')
  if (!link.includes('page')) {
    switch (link.substring(indexOfString)) {
      case 'products':
        link += `?page=${result.page}`
        break
      case 'products/':
        link = link.replace('products/', `products?page=${result.page}`)
        break
      case 'products?': default:
        link += `&page=${result.page}`
        break
    }
  }
  const prevLink = (result.hasPrevPage)
    ? link.replace(`page=${result.page}`, `page=${result.prevPage}`)
    : null
  const nextLink = (result.hasNextPage)
    ? link.replace(`page=${result.page}`, `page=${result.nextPage}`)
    : null

  return { prevLink, nextLink }
}

const createHash = (pwd) => brcrypt.hashSync(pwd, brcrypt.genSaltSync(10))

const isValidPassword = (user, pwd) => brcrypt.compareSync(pwd, user.password)
// Function to generate the token once we have the user data sended for the user

const generateToken = (user) => {
  return jwt.sign(user, config.PRIVATE_KEY, { expiresIn: 3600 }) // 3600 seconds == 1 hour
}

function randomString (length) {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length)
}

export { __dirname, patterns, getLink, createHash, isValidPassword, generateToken, randomString }
