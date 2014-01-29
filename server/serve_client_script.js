module.exports = function(req, resp, next){
  if (req.url === '/testem.js'){
    resp.setHeader('Content-Type', 'text/javascript')
    resp.end("console.log('Hello from Testem.js')")
  }else{
    next()
  }
}
