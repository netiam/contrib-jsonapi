import bodyParser from 'body-parser'
import express from 'express'
import routes from './routes'

export default function() {
  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.json({type: 'application/vnd.api+json'}))
  app.use(bodyParser.urlencoded({extended: true}))

  routes(app)

  return app
}
