import _ from 'lodash'
import pluralize from 'pluralize'

function documentLinks(req, baseUrl, document) {
  const {id, type} = document
  const url = `${req.protocol}://${req.get('host')}${baseUrl}/${pluralize(type)}/${id}`
  return {
    self: url
  }
}

function relationshipLinks(req, baseUrl, document, relationship) {
  const {id, type} = document
  const url = `${req.protocol}://${req.get('host')}${baseUrl}/${pluralize(type)}/${id}`
  return {
    self: `${url}/relationships/${relationship}`,
    related: `${url}/${relationship}`
  }
}

function links(req, res, baseUrl) {
  const body = res.body

  // resource objects
  if (_.isArray(body.data) && body.data.length > 0) {
    body.data.forEach(document => {
      document.links = documentLinks(req, baseUrl, document)
      if (document.relationships) {
        _.forEach(document.relationships, (val, key) => {
          document.relationships[key].links = relationshipLinks(req, baseUrl, document, key)
        })
      }
    })
  } else if (_.isObject(body.data)) {
    body.data.links = documentLinks(req, baseUrl, body.data)
    if (body.data.relationships) {
      _.forEach(body.data.relationships, (val, key) => {
        body.data.relationships[key].links = relationshipLinks(req, baseUrl, body.data, key)
      })
    }
  }

  // includes
  if (_.isArray(body.included) && body.included.length > 0) {
    body.included.forEach(document => {
      document.links = documentLinks(req, baseUrl, document)
    })
  }

  // body
  if (_.isArray(body.data) && body.data.length > 0) {
    const type = body.data[0].type
    return {
      self: `${req.protocol}://${req.get('host')}${baseUrl}/${pluralize(type)}`
    }
  } else if (_.isObject(res.body.data)) {
    const {id, type} = res.body.data
    return {
      self: `${req.protocol}://${req.get('host')}${baseUrl}/${pluralize(type)}/${id}`
    }
  }

  return null
}

export default function({baseUrl = '/'}) {

  return function(req, res) {
    if (res.meta) {
      res.body.meta = res.meta
    }

    res.body.links = links(req, res, baseUrl)

    res.json(res.body)
  }
}
