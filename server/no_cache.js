module.exports = function(req, resp, next){
  resp.setHeader('Cache-Control', 'No-cache')
  resp.setHeader('Pragma', 'No-cache')
  next()
}