var st = require('st')

module.exports = function(){
  return st({
    path: process.cwd(), 
    url: '/',
    index: false,
    cache: false
  })
}