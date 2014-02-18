var istanbul = require('istanbul')
var Instrumenter = istanbul.Instrumenter
var path = require('path')
var fs = require('fs')

module.exports = function(config){
  return function(req, resp, next){
    if (path.extname(req.url) === '.js'){
      var filepath = '.' + req.url
      fs.readFile(filepath, function(err, data){
        if (err) return next(err)
        var instr = new Instrumenter
        var newCode = new Buffer(instr.instrumentSync(data + '', filepath))
        resp.writeHead(200, {
          'Content-Type': 'text/javascript',
          'Content-Length': newCode.length
        })
        resp.end(newCode)
      })
    }else if (req.url === '/testem/istanbul/results' &&
      req.method === 'POST'){
      req.pipe(fs.createWriteStream('coverage.json'))
      resp.end('ok')
    }else if (resp.$){
      resp.$('script').last().after(
        '\n<script>' +
        'Testem.on("all-test-results", function(){\n' +
        '  var xhr = new XMLHttpRequest\n' +
        '  xhr.open("POST", "/testem/istanbul/results")\n' +
        '  xhr.send(JSON.stringify(window.__coverage__))\n' +
        '})' +
        '</script>')
      next() 
    }else{
      next()
    }
  }
}