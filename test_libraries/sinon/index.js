var st = require('st')

var mount = st({
  path: __dirname,
  url: '/testem/sinon/',
  index: false,
  cache: true
})

module.exports = function(config){
  return function(req, resp, next){
    if (resp.$){
      if (config.libraries && config.libraries['sinon']){
        resp.$('script').first().after('\n<script src="/testem/sinon/sinon.js"></script>') 
      }
      next()
    }else{
      mount(req, resp, next)
    }
  }
}