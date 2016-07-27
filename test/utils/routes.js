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
      .jsonapi({model: Project})
  )

  router.post(
    '/users',
    netiam({plugins})
      .rest({model: User})
      .jsonapi({model: Project})
  )

  router.get(
    '/users',
    netiam({plugins})
      .rest({model: User})
      .jsonapi({model: Project})
  )

  router.get(
    '/users/:id',
    netiam({plugins})
      .rest({model: User})
      .jsonapi({model: Project})
  )

  router.put(
    '/users/:id',
    netiam({plugins})
      .rest({model: User})
      .jsonapi({model: Project})
  )

  router.delete(
    '/users/:id',
    netiam({plugins})
      .rest({model: User})
      .jsonapi({model: Project})
  )

  app.use('/', router)

}
