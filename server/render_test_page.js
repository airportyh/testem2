module.exports = function(){
  return function(req, resp, next){
    if (resp.$){
      resp.end(resp.$.html())
    }else{
      next()
    }
  }
}