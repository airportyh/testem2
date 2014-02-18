var socketIo = require('socket.io-client')
var socket = socketIo.connect('http://localhost')

var queue = []
var connected = false
var listeners = {}
socket.on('connect', function(){
  connected = true
  for (var i = 0; i < queue.length; i++){
    var args = queue[i]
    var evt = args[0]
    socket.emit.apply(socket, args)
    if (listeners[evt]){
      for (var j = 0; j < listeners[evt].length; j++){
        listeners[evt][j].apply(null, arguments)
      }
    }
  }
  queue = []
})

window.Testem = {
  emit: function(evt){
    if (!connected){
      queue.push(arguments)
    }else{
      socket.emit.apply(socket, arguments)
      if (listeners[evt]){
        for (var i = 0; i < listeners[evt].length; i++){
          listeners[evt][i].apply(null, arguments)
        }
      }
    }
  },
  on: function(evt, callback){
    console.log('on ' + evt)
    if (!listeners[evt]){
      listeners[evt] = []
    }
    listeners[evt].push(callback)
  }
}