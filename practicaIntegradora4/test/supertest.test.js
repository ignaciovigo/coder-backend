import chai from 'chai';
import supertest from 'supertest';
import studentsModel from '../src/services/db/models/students.js';

const expect = chai.expect;

const requester = supertest("http://localhost:8080");


describe("Testing App Api Endpoints.", function () {
    const user = {
        email: 'example@example.com', password: '123123', name: 'User', lastName: 'Regular', age: 25
      }

    describe("Testing Students Api", function () {
        it('POST /api/jwt/register should create a student', async function () {
            const result = await requester.post('/api/jwt/register').send(user)
            expect(result.status).to.equal(201)
            expect(result._body).to.be.an('object')
            expect(result._body).to.have.property('status', 'success')
            expect(result._body).to.have.property('message') 
        } )

        it('GET api/students should return an array with all the students stored in the database', async function(){
            const result = await requester.get('/api/students')
            expect(result.status).to.equal(200)
            expect(result._body).to.be.an('array')
            expect(result._body[0]).to.have.property('_id').that.is.a('string');
            expect(result._body[0]).to.have.property('name').that.is.a('string');
            expect(result._body[0]).to.have.property('lastName').that.is.a('string');
            expect(result._body[0]).to.have.property('email').that.is.a('string')
            expect(result._body[0]).to.have.property('age').that.is.a('string');
            expect(result._body[0]).to.have.property('password').that.is.a('string');
            expect(result._body[0]).to.have.property('role', 'user');
            expect(result._body[0]).to.have.property('courses').that.is.an('array');
        })
    });
    
});