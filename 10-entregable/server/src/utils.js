import config from './config/config.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import brcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { faker } from '@faker-js/faker'
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
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  age: /^(?!00)[0-9]{2}$/
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

const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
    user: config.EMAIL,
    pass: config.NODEMAILER
  }
})

const formatDate = (dateTimeString) => {
  const dateTime = new Date(dateTimeString)

  const year = dateTime.getFullYear()
  const month = ('0' + (dateTime.getMonth() + 1)).slice(-2)
  const day = ('0' + dateTime.getDate()).slice(-2)
  const hours = ('0' + dateTime.getHours()).slice(-2)
  const minutes = ('0' + dateTime.getMinutes()).slice(-2)
  const seconds = ('0' + dateTime.getSeconds()).slice(-2)

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

function generateProducts ({ numOfProducts = 50 }) {
  const products = []
  for (let i = 0; i < numOfProducts; i++) {
    const product = {
      title: faker.commerce.productName(),
      price: Number(faker.commerce.price()),
      category: faker.commerce.department(),
      thumbnails: [`${faker.image.url()}.png`, `${faker.image.url()}.png`, `${faker.image.url()}.png`],
      description: faker.commerce.productDescription(),
      code: faker.string.nanoid(5),
      stock: faker.number.int({ min: 1, max: 50 }),
      status: faker.datatype.boolean(),
      _id: faker.database.mongodbObjectId()
    }
    products.push(product)
  }
  return products
}

export { __dirname, patterns, getLink, createHash, isValidPassword, generateToken, randomString, transport, formatDate, generateProducts }
