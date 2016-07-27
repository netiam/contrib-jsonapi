import _ from 'lodash'
import pluralize from 'pluralize'

function documentLinks(req, document) {
  const {id, type} = document
  const url = `${req.protocol}://${req.get('host')}${req.config.baseUrl}/${pluralize(type)}/${id}`
  return {
    self: url
  }
}

function relationshipLinks(req, document, relationship) {
  const {id, type} = document
  const url = `${req.protocol}://${req.get('host')}${req.config.baseUrl}/${pluralize(type)}/${id}`
  return {
    self: `${url}/relationships/${relationship}`,
    related: `${url}/${relationship}`
  }
}

function links(req, res, type) {
  const body = res.body

  // resource objects
  if (_.isArray(body.data)) {
    body.data.forEach(document => {
      document.links = documentLinks(req, document)
      if (document.relationships) {
        _.forEach(document.relationships, (val, key) => {
          if (!val) {
            return
          }
          document.relationships[key].links = relationshipLinks(req, document, key)
        })
      }
    })
  } else if (_.isObject(body.data)) {
    body.data.links = documentLinks(req, body.data)
    if (body.data.relationships) {
      _.forEach(body.data.relationships, (val, key) => {
        if (!val) {
          return
        }
        body.data.relationships[key].links = relationshipLinks(req, body.data, key)
      })
    }
  }

  // includes
  if (_.isArray(body.included) && body.included.length > 0) {
    body.included.forEach(document => {
      document.links = documentLinks(req, document)
    })
  }

  // body
  if (_.isArray(body.data)) {
    return {
      self: `${req.protocol}://${req.get('host')}${req.config.baseUrl}/${pluralize(type)}`
    }
  } else if (_.isObject(res.body.data)) {
    const {id} = res.body.data
    return {
      self: `${req.protocol}://${req.get('host')}${req.config.baseUrl}/${pluralize(type)}/${id}`
    }
  }

  return null
}

export default function({model}) {

  const type = _.kebabCase(model.name)

  return function(req, res) {
    if (res.meta) {
      res.body.meta = res.meta
    }

    if (res.body) {
      res.body.links = links(req, res, type)
    }

    res.json(res.body)
  }
}
