module.exports = function(socket){

  socket.on('connection', function(){
    console.log('live reload connected')
  })
  
}