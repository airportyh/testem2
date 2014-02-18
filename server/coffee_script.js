var path = require('path')
var coffee = require('coffee-script')
var fs = require('fs')
var through = require('through')
var fileset = require('fileset')

module.exports = function(config){
  return function(req, resp, next){
    if (resp.$){
      var lastScript = resp.$('script').last()
      fileset(config.src_files, function(err, files){
        files.reverse().forEach(function(file){
          if (path.extname(file) === '.coffee'){
            var base = path.basename(file, '.coffee')
            lastScript.after('<script src="' + base + '.js"></script>\n')
          }
        })
        next()
      })
    }else{
      coffeeware(req, resp, next)
    }
  }
}

function coffeeware(req, res, next){
  if (path.extname(req.url) === '.js'){
    var coffeepath = '.' + req.url.replace(/\.js$/, '.coffee')
    fs.exists(coffeepath, function(yes){
      if (yes){
        fs.readFile(coffeepath, function(err, code){
          if (err) return next(err)
          code = code + ''
          try{
            var jsCode = new Buffer(coffee.compile(code))
            res.writeHead(200, {
              'Content-Length': jsCode.length,
              'Content-Type': 'text/javascript'
            })
            res.end(jsCode)
          }catch(err){
            return next(err)
          }
        })
      }else{
        next()
      }
    })
  }else{
    next()
  }
}
