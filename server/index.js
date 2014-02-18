var socket = require('./socket')
var http = require('http')
var stack = require('stack')
var noCache = require('./no_cache')
var static = require('./static')
var serveClientScript = require('./serve_client_script')
var jasmine = require('../test_frameworks/jasmine')
var renderTestPage = require('./render_test_page')
var injectSrcFiles = require('./inject_src_files')
var sinon = require('../test_libraries/sinon')
var coffee = require('./coffee_script')
var is = require('is-type')
var assert = require('assert')

module.exports = function(config){

  var middlewares = []

  
  middlewares.push(
    noCache(config),
    serveClientScript(config)
  )
  
  middlewares.push(frameworkMiddleware(config))
  middlewares = middlewares.concat(libraryMiddlewares(config))
  middlewares.push(coffee(config))
  
  middlewares.push(injectSrcFiles(config))
  middlewares.push(renderTestPage(config))

  middlewares.push(static(config))

  var server = http.createServer(
    stack.apply(null, middlewares)
  )

  socket(server, config)

  var port = 7357
  server.listen(port)
  console.log('Listening on', port)

}

function frameworkMiddleware(config){
  var framework = config.framework
  assert(is.string(framework) || is.object(framework))
  if (is.object(framework)){
    framework = Object.keys(framework)[0]
  }
  console.log('test framework:', framework)
  return require('../test_frameworks/' + framework)(config)
}

function libraryMiddlewares(config){
  if (!config.libraries) return []
  var ret = []
  assert(is.object(config.libraries))
  var libraries = config.libraries
  for (var lib in libraries){
    console.log('test library:', lib)
    ret.push(require('../test_libraries/' + lib)(config))
  }
  return ret
}