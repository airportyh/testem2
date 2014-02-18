require('./socket.io.mute')
var socketIo = require('socket.io')

module.exports = function(server){
  
  var socket = socketIo.listen(server)

  socket.on('connection', function(socket){
    console.log('connected socket', socket.id)

    socket.on('tests-start', function(){
      console.log('Tests started')
    })

    socket.on('test-result', function(result){
      console.log('Test result:', result)
    })

    socket.on('all-test-results', function(){
      console.log('Tests ended')
    })

    socket.on('disconnect', function(){
      console.log('connection disconnected')
    })
  })

  return socket

}