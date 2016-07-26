import request from 'supertest'
import uuid from 'uuid'
import util from 'util'
import Promise from 'bluebird'
import appMock from './utils/app'
import projectFixture from './fixtures/project'
import userFixture from './fixtures/user'
import User from './models/user'
import Project from './models/project'
import {
  setup,
  teardown
} from './utils/db'

const app = appMock()
const user = Object.assign({}, userFixture, {id: uuid.v4()})
const project = Object.assign({}, projectFixture, {id: uuid.v4()})

describe('netiam', () => {
  describe('JSONAPI', () => {

    before(setup)
    after(teardown)

    it('should create project', done => {
      Project
        .create(project)
        .then(() => done())
        .catch(done)
    })

    it('should create users', done => {
      const users = []
      users.push(user)
      for (let i = 0; i < 10; i += 1) {
        const username = uuid.v4()
        users.push(Object.assign({}, userFixture, {
          email: `${username}@neti.am`,
          username: username
        }))
      }

      User
        .bulkCreate(users)
        .then(() => {
          return User.findAll()
        })
        .then(users => {
          return Promise.all(users.map(user => {
            return user.setProjects([project.id])
          }))
        })
        .then(() => {
          return User.findAll({
            include: [
              {
                model: Project,
                as: 'projects',
                included: ['id']
              }
            ]
          })
        })
        .then(() => done())
        .catch(done)
    })

    it('should fetch user', done => {
      request(app)
        .get(`/users/${user.id}?include=projects`)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          const json = res.body

          json.should.be.an.Object()
          json.should.have.properties(['data', 'included', 'links'])
          json.data.should.be.Object()
          json.data.should.have.properties([
            'id',
            'type',
            'attributes',
            'relationships',
            'links'
          ])
          json.data.relationships.should.be.Object()
          json.data.relationships.should.have.properties([
            'projects'
          ])

          json.included.should.be.Array()
          json.included.should.have.length(1)
          json.included[0].should.have.properties([
            'id',
            'type',
            'attributes',
            'links'
          ])
          json.included[0].type.should.eql('project')
          json.included[0].links.should.have.properties(['self'])
        })
        .end(err => {
          if (err) {
            return done(err)
          }
          done()
        })
    })

    it('should fetch users', done => {
      request(app)
        .get('/users?include=projects')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          const json = res.body

          json.should.be.an.Object()
          json.should.have.properties(['data', 'included', 'links'])
          json.data.should.be.Array()
          json.data.should.have.length(10)
          json.data[0].should.have.properties([
            'id',
            'type',
            'attributes',
            'relationships',
            'links'
          ])
          json.data[0].relationships.should.be.Object()
          json.data[0].relationships.should.have.properties([
            'projects'
          ])

          json.included.should.be.Array()
          json.included.should.have.length(1)
          json.included[0].should.have.properties([
            'id',
            'type',
            'attributes',
            'links'
          ])
          json.included[0].type.should.eql('project')
          json.included[0].links.should.have.properties(['self'])
        })
        .end(err => {
          if (err) {
            return done(err)
          }
          done()
        })
    })

  })
})
