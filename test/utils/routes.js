import express from 'express'
import netiam from 'netiam'
import {plugins} from './api'
import Project from '../models/project'
import User from '../models/user'

export default function(app) {

  const router = express.Router()

  router.post(
    '/projects',
    netiam({plugins})
      .rest({model: Project})
      .jsonapi({baseUrl: '/v2'})
  )

  router.post(
    '/users',
    netiam({plugins})
      .rest({model: User})
      .jsonapi({baseUrl: '/v2'})
  )

  router.get(
    '/users',
    netiam({plugins})
      .rest({model: User})
      .jsonapi({baseUrl: '/v2'})
  )

  router.get(
    '/users/:id',
    netiam({plugins})
      .rest({model: User})
      .jsonapi({baseUrl: '/v2'})
  )

  router.put(
    '/users/:id',
    netiam({plugins})
      .rest({model: User})
      .jsonapi({baseUrl: '/v2'})
  )

  router.delete(
    '/users/:id',
    netiam({plugins})
      .rest({model: User})
      .jsonapi({baseUrl: '/v2'})
  )

  app.use('/', router)

}
