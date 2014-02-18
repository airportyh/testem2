var socketIo = require('socket.io-client')
var socket = socketIo.connect('http://localhost')

var queue = []
var connected = false
socket.on('connect', function(){
  connected = true
  for (var i = 0; i < queue.length; i++){
    var args = queue[i]
    socket.emit.apply(socket, args)
  }
  queue = []
})

window.Testem = {
  emit: function(){
    if (!connected){
      queue.push(arguments)
    }else{
      socket.emit.apply(socket, arguments)
    }
  }
}