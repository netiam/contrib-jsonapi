# netiam-contrib-jsonapi

[![Build Status](https://travis-ci.org/netiam/contrib-jsonapi.svg)](https://travis-ci.org/netiam/contrib-jsonapi)
[![Dependencies](https://david-dm.org/netiam/contrib-jsonapi.svg)](https://david-dm.org/netiam/contrib-jsonapi)
[![npm version](https://badge.fury.io/js/netiam-contrib-jsonapi.svg)](http://badge.fury.io/js/netiam-contrib-jsonapi)

> A JSON API plugin for netiam

## Example

```js
app.get(
  '/users',
  api()
    .auth(…)
    .rest(…)
    .acl.res(…)
    .jsonapi({…})
)
```

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
