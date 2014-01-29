var http = require('http')
var stack = require('stack')
var noCache = require('./no_cache')
var static = require('./static')
var serveClientScript = require('./serve_client_script')
var testFramework = require('../test_frameworks')

module.exports = function(config){

  var fw = testFramework(config)
  var server = http.createServer(
    stack(
      noCache,
      serveClientScript,
      fw,
      static
    )
  )
  var port = 7357
  server.listen(port)
  console.log('Listening on', port)
}