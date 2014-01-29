var fs = require('fs')
var path = require('path')
var handlebars = require('handlebars')
var st = require('st')
var fileset = require('fileset')

module.exports = function(config){

  var framework = config.framework

  var tmpPath = path.join(
    __dirname, 
    framework, 
    'runner.handlebars')

  var template = handlebars.compile(
    fs.readFileSync(tmpPath) + '')
  
  var mount = st({
    path: path.join(__dirname, framework),
    url: '/testem/' + framework + '/',
    index: false,
    cache: false
  })

  return function(req, resp, next){
    var m
    if (req.url.match(/^\/([0-9]+)$/)){
      fileset(config.src_files, function(err, files){
        files = files.map(function(file){
          return {src: file}
        })
        resp.end(template({
          scripts: files,
          styles: []
        }))
      })
    }else{
      mount(req, resp, next)
    }
  }

}