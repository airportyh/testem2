var browserify = require('browserify')
var path = require('path')

var cache = false
var cachedCode = null
module.exports = function(){
  return function(req, resp, next){
    if (req.url === '/testem.js'){
      resp.setHeader('Content-Type', 'text/javascript')
      if (cachedCode){
        resp.end(cachedCode)
        return
      }
      var b = browserify([path.join(__dirname, '..', 'client')])
      b.bundle(function(err, data){
        if (err){
          resp.writeHead(500, err.message)
          return
        }
        data = data + ''
        resp.end(data)
        if (cache){
          cachedCode = data
        }
      })
    }else{
      next()
    }
  }
}