var fs = require('fs')
var path = require('path')
var st = require('st')
var cheerio = require('cheerio')
var assert = require('assert')

module.exports = function(config){

  var testPageHtml

  var mount = st({
    path: __dirname,
    url: '/testem/mocha/',
    index: false,
    cache: false
  })

  return function(req, resp, next){
    var m
    if (req.url.match(/^\/([0-9]+)$/)){
      loadTestPage(resp, next)
    }else{
      mount(req, resp, next)
    }

    function loadTestPage(){
      if (testPageHtml){
        return load$()
      }
      var filepath = path.join(__dirname, 'runner.html')
      fs.readFile(filepath, function(err, data){
        testPageHtml = data + ''
        load$()
      })
    }

    function load$(){
      resp.$ = cheerio.load(testPageHtml)
      var interface = config.framework.mocha
      if (interface === true){
        interface = 'bdd'
      }
      if (['bdd', 'tdd', 'qunit', 'exports'].indexOf(interface) === -1){
        return next(new Error('Unknown Mocha interface: ' + interface))
      }
      resp.$('script').first().after('\n<script>mocha.setup("' + interface + '")</script>')
      next()
    }

  }

}