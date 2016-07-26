import _ from 'lodash'
import pluralize from 'pluralize'

function documentLinks(req, document) {
  const {id, type} = document
  return {
    self: req.protocol + '://' + req.get('host') + '/' + pluralize(type) + '/' + id
  }
}

function relationshipLinks(req, document, relationship) {
  const {id, type} = document
  const baseUrl = req.protocol + '://' + req.get('host') + '/' + pluralize(type) + '/' + id
  return {
    self: baseUrl + '/relationships/' + relationship,
    related: baseUrl + '/' + relationship
  }
}

function links(req, res) {
  const body = res.body

  // resource objects
  if (_.isArray(body.data) && body.data.length > 0) {
    body.data.forEach(document => {
      document.links = documentLinks(req, document)
      if (document.relationships) {
        _.forEach(document.relationships, (val, key) => {
          document.relationships[key].links = relationshipLinks(req, document, key)
        })
      }
    })
  } else if (_.isObject(body.data)) {
    body.data.links = documentLinks(req, body.data)
    if (body.data.relationships) {
      _.forEach(body.data.relationships, (val, key) => {
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
  if (_.isArray(body.data) && body.data.length > 0) {
    const type = body.data[0].type
    const baseUrl = req.protocol + '://' + req.get('host') + '/' + pluralize(type)
    return {
      self: baseUrl
    }
  } else if (_.isObject(res.body.data)) {
    const {id, type} = res.body.data
    const baseUrl = req.protocol + '://' + req.get('host') + '/' + pluralize(type) + '/' + id
    return {
      self: baseUrl
    }
  }

  return null
}

export default function() {
  return function(req, res) {
    if (_.isArray(res.body.data)) {
      res.body.data.forEach(document => documentLinks(req, document))
    } else if (_.isObject(res.body.data)) {
      documentLinks(req, res.body.data)
    }

    if (_.isArray(res.body.included)) {
      res.body.included.forEach(document => documentLinks(req, document))
    }

    if (res.meta) {
      res.body.meta = res.meta
    }

    res.body.links = links(req, res)

    res.json(res.body)
  }
}
