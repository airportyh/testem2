var fileset = require('fileset')
var path = require('path')

module.exports = function(config){
  return function(res, resp, next){
    if (resp.$){
      var lastScript = resp.$('script').last()
      fileset(config.src_files, function(err, files){
        files.reverse().forEach(function(file){
          if (path.extname(file) === '.js'){
            lastScript.after('<script src="' + file + '"></script>\n')
          }
        })
        next()
      })
    }else{
      next()
    }
  }
}