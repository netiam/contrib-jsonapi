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
        .then(users => {
          /*console.log(
            util.inspect(
              users.map(user => user.toJSON()),
              {depth: null}
            )
          )*/
        })
        .then(() => done())
        .catch(done)
    })

    it('should fetch user', done => {
      request(app)
        .get(`/users/${user.id}`)
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(err => {
          if (err) {
            return done(err)
          }
          done()
        })
    })

    it('should fetch users', done => {
      request(app)
        .get('/users')
        .set('Accept', 'application/json')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(err => {
          if (err) {
            return done(err)
          }
          done()
        })
    })

  })
})
