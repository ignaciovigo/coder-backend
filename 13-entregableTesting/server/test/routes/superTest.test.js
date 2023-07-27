import chai from 'chai'
import supertest from 'supertest'

const expect = chai.expect
const requester = supertest('http://localhost:8080')

describe('Testing main routers', () => {
  const adminUser = {
    email: 'admin@coder.com', password: '123123', firstName: 'Admin', lastName: 'Admin', age: '25'
  }
  const regularUser = {
    email: 'fran@example.com', password: '123123', firstName: 'User', lastName: 'Regular', age: '25'
  }
  let adminCookie
  let regularCookie
  let idProductCreated
  const mockProduct = {
    title: 'Samsung J5',
    description: 'A galactic map to explore the universe!',
    price: 223,
    thumbnails: [],
    code: 'adssdsy6ssa',
    stock: 324,
    status: false,
    category: 'Technology'
  }
  /// ================== TEST ENDPOINTS REGISTER AND LOGIN =====================
  describe('Test register and login', () => {
    it('POST /api/users/register should create an admin user', async function () {
      const result = await requester.post('/api/users/register').send(adminUser)
      expect(result.status).to.equal(200)
      expect(result._body).to.be.an('object')
      expect(result._body).to.have.property('status', 'success')
      expect(result._body).to.have.property('message', 'User created successfully!')
    })

    it('POST /api/users/register should return an error the email is already in use', async function () {
      const result = await requester.post('/api/users/register').send(adminUser)
      expect(result.status).to.equal(400)
      expect(result._body).to.be.an('object')
      expect(result._body).to.have.property('status', 'error')
      expect(result._body).to.have.property('message', 'The email is already in use')
    })

    it('POST /api/users/register should return an error for the fields incomplete', async function () {
      const emptyDataUser = {}
      const result = await requester.post('/api/users/register').send(emptyDataUser)
      expect(result.status).to.equal(400)
      expect(result._body).to.be.an('object')
      expect(result._body).to.have.property('status', 'error')
      expect(result._body).to.have.property('message', 'The fields provided are incompleted')
    })

    it('POST /api/users/register should create a regular user', async function () {
      const result = await requester.post('/api/users/register').send(regularUser)
      expect(result.status).to.equal(200)
      expect(result._body).to.be.an('object')
      expect(result._body).to.have.property('status', 'success')
      expect(result._body).to.have.property('message', 'User created successfully!')
    })

    it('POST /api/jwt/login should login the user role admin', async function () {
      const result = await requester.post('/api/jwt/login').send({ email: adminUser.email, password: adminUser.password })
      adminCookie = result.headers['set-cookie'][0]
    })

    it('POST /api/jwt/login should login the user role user', async function () {
      const result = await requester.post('/api/jwt/login').send({ email: regularUser.email, password: regularUser.password })
      regularCookie = result.headers['set-cookie'][0]
    })
  })

  // ================== TEST ENDPOINT /API/PRODUCTS =====================
  describe('Testing /api/products endpoints', () => {
    it('GET /api/products should respond with products and links', async function () {
      const result = await requester
        .get('/api/products')
        .set('Cookie', adminCookie)

      expect(result.status).to.equal(200)
      expect(result._body).to.be.an('object')
      expect(result._body).to.have.property('status', 'success')
      expect(result._body).to.have.nested.property('payload.docs').that.is.an('array')
      expect(result._body).to.have.nested.property('payload.limit').that.is.a('number')
      expect(result._body).to.have.nested.property('payload.totalPages').that.is.a('number')
      expect(result._body).to.have.nested.property('payload.page').that.is.a('number')
      expect(result._body).to.have.nested.property('payload.hasPrevPage').that.is.a('boolean')
      expect(result._body).to.have.nested.property('payload.hasNextPage').that.is.a('boolean')
      expect(result._body).to.have.nested.property('payload.prevPage')
      expect(result._body).to.have.nested.property('payload.nextPage')
      expect(result._body).to.have.nested.property('payload.prevLink')
      expect(result._body).to.have.nested.property('payload.nextLink')
    })

    it('GET /api/products should respond with user error for invalid limit parameter', async function () {
      const result = await requester
        .get('/api/products')
        .set('Cookie', adminCookie)
        .query({ limit: 'invalid', page: 1, sort: 'asc', query: 'example' })

      expect(result.status).to.equal(400)
      expect(result.body).to.have.property('status', 'error')
    })
    it('GET /api/products should respond with user error for invalid limit parameter', async function () {
      const result = await requester
        .get('/api/products')
        .set('Cookie', adminCookie)
        .query({ limit: 10, page: 'invalid', sort: 'asc', query: 'example' })

      expect(result.status).to.equal(400)
      expect(result.body).to.have.property('status', 'error')
    })

    it('GET /api/products should respond with user error for invalid limit parameter', async function () {
      const result = await requester
        .get('/api/products')
        .set('Cookie', adminCookie)
        .query({ limit: 10, page: 1, sort: 'invalid', query: 'example' })

      expect(result.status).to.equal(400)
      expect(result.body).to.have.property('status', 'error')
    })

    it('POST /api/products should create a new product and respond with success', async function () {
      const newProduct = {
        title: 'Luxurious Granite Pants',
        description: 'These pants are made of high-quality granite fabric, providing durability and comfort.',
        price: 46.99,
        thumbnails: [
          'https://example.com/images/pants-front.jpg',
          'https://example.com/images/pants-back.jpg'
        ],
        code: 'asdfas2sd',
        stock: 50,
        status: true,
        category: 'Apparel'
      }
      const result = await requester
        .post('/api/products')
        .set('Cookie', adminCookie)
        .send(newProduct)

      expect(result.status).to.equal(200)
      expect(result.body).to.be.an('object')
      expect(result.body).to.have.property('status', 'success')
      expect(result.body).to.have.property('message')
      idProductCreated = result.body.message.split(' ').pop()
    })

    it('POST /api/products should respond with an error when required fields are missing', async function () {
      const invalidProduct = {}
      const result = await requester
        .post('/api/products')
        .set('Cookie', adminCookie)
        .send(invalidProduct)

      expect(result.status).to.equal(500)
      expect(result.body).to.be.an('object')
      expect(result.body).to.have.property('status', 'error')
      expect(result.body).to.have.property('message')
    })

    it('DEL /api/products/:pid should delete a product and respond with success', async function () {
      const response = await requester
        .del(`/api/products/${idProductCreated}`)
        .set('Cookie', adminCookie)

      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('status', 'success')
      expect(response.body).to.have.property('message')
    })

    it('DEL /api/products/:pid should respond with error when the provided id is not a string', async function () {
      const productIdNotValid = 123
      const response = await requester
        .del(`/api/products/${productIdNotValid}`)
        .set('Cookie', adminCookie)

      expect(response.status).to.equal(500)
      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('status', 'error')
      expect(response.body).to.have.property('message')
    })
  })
  /// ================== TEST ENDPOINT /API/CARTS =====================
  describe('Testing /api/carts endpoints', () => {
    let cartIdCreated

    before(async () => {
      const result = await requester.post('/api/products').set('Cookie', adminCookie).send(mockProduct)
      idProductCreated = result.body.message.split(' ').pop()
    })
    after(async () => {
      await requester.delete(`/api/products/${idProductCreated}`).set('Cookie', adminCookie)
    })
    it('POST /api/carts should create a new cart and respond with success', async function () {
      const response = await requester
        .post('/api/carts')
        .set('Cookie', regularCookie)

      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('status', 'success')
      expect(response.body).to.have.property('payload').that.is.an('object')
      expect(response._body).to.have.nested.property('payload.products').that.is.an('array')
      expect(response._body).to.have.nested.property('payload._id').that.is.a('string')
      cartIdCreated = response._body.payload._id
    })

    it('GET /api/carts/:cid should get a cart by id and respond with success and the payload about the cart', async function () {
      const emptyArray = []
      const response = await requester
        .get(`/api/carts/${cartIdCreated}`)
        .set('Cookie', regularCookie)

      expect(response.status).to.equal(200)
      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('status', 'success')
      expect(response.body).to.have.property('payload').that.is.an('object')
      expect(response._body).to.have.nested.property('payload.products').that.is.an('array')
      expect(response._body).to.have.nested.property('payload._id').that.is.a('string')
      expect(response._body).to.have.nested.property('payload.products.length').to.be.equal(emptyArray.length)
    })

    it('GET /api/carts/:cid should respond with user error when the provided cart id is invalid', async function () {
      const response = await requester
        .get('/api/carts/123')
        .set('Cookie', regularCookie)

      expect(response.status).to.equal(500)
      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('status', 'error')
    })

    it('PUT /api/carts/:cid should add products to the cart and respond with status success and payload', async () => {
      const arrayWithProduct = [{ product: idProductCreated, quantity: 4 }]
      const result = await requester
        .put(`/api/carts/${cartIdCreated}`)
        .set('Cookie', regularCookie)
        .send(arrayWithProduct)

      expect(result.body).to.have.property('status', 'success')
      expect(result.body.payload).to.have.property('_id').that.is.a('string')
      expect(result.body.payload).to.have.property('products').that.is.an('array')
      expect(result.body.payload.products).to.be.an('array').that.is.not.empty
      expect(result.body.payload.products).to.have.lengthOf(1)
      expect(result.body.payload.products[0]).to.be.an('object')
      expect(result.body.payload.products[0]).to.have.property('product').that.is.a('string')
      expect(result.body.payload.products[0]).to.have.property('quantity').that.is.a('number')
    })

    it('PUT /api/carts/:cid should add invalid id products to the cart and respond with status error', async () => {
      const arrayWithInvalidProduct = [{ product: '23', quantity: 4 }]
      const result = await requester
        .put(`/api/carts/${cartIdCreated}`)
        .set('Cookie', regularCookie)
        .send(arrayWithInvalidProduct)
      expect(result.status).to.equal(500)
      expect(result.body).to.have.property('status', 'error')
    })

    it('PUT /api/carts/:cid should add incorrect data structure to the cart and respond with status error', async () => {
      const incorrectDataStructure = { product: '23', quantity: 4 }
      const result = await requester
        .put(`/api/carts/${cartIdCreated}`)
        .set('Cookie', regularCookie)
        .send(incorrectDataStructure)
      expect(result.status).to.equal(400)
      expect(result.body).to.have.property('status', 'error')
      expect(result.body).to.have.property('message', 'The data received is not an Array')
    })
  })
})
