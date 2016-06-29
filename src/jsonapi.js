export default function() {
  return function(req, res) {
    if (!res.body) {
      return res
        .status(204)
        .end()
    }

    res.json(res.body)
  }
}
