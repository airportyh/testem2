var st = require('st')

module.exports = function(config){

  var mount = st({
    path: __dirname,
    url: '/testem/chai/',
    index: false,
    cache: false
  })

  return function(req, resp, next){
    if (resp.$){
      if (config.libraries && config.libraries.chai){
        var markup = '\n<script src="/testem/chai/chai.js"></script>'
        var type = config.libraries.chai
        if (type === 'assert'){
          markup += '\n<script>assert = chai.assert</script>'
        }else if (type === 'should'){
          markup += '\n<script>chai.should()</script>'
        }else{ // expect is the default
          markup += '\n<script>expect = chai.expect</script>'
        }
        resp.$('script').first().after(markup)
      }
      next()
    }else{
      mount(req, resp, next)
    }
  }
  
}