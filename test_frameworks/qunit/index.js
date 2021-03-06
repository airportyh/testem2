var fs = require('fs')
var path = require('path')
var st = require('st')
var cheerio = require('cheerio')
var assert = require('assert')

module.exports = function(config){

  var testPageHtml

  var mount = st({
    path: __dirname,
    url: '/testem/qunit/',
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
      next()
    }

  }

}