
// patch Socket.IO so it doesn't use the exponential delay algorithm for
// reconnection so that if you quit testem and then restart again, the
// reconnection will be quick.
var socketIo = require('socket.io-client')

socketIo.Socket.prototype.reconnect = function () {
  this.reconnecting = true;
  this.reconnectionAttempts = 0;
  this.reconnectionDelay = this.options['reconnection delay'];

  var self = this
    , tryMultiple = this.options['try multiple transports']
    , limit = this.options['reconnection limit'];

  function reset () {
    if (self.connected) {
      for (var i in self.namespaces) {
        if (self.namespaces.hasOwnProperty(i) && '' !== i) {
            self.namespaces[i].packet({ type: 'connect' });
        }
      }
      self.publish('reconnect', self.transport.name, self.reconnectionAttempts);
    }

    clearTimeout(self.reconnectionTimer);

    self.removeListener('connect_failed', maybeReconnect);
    self.removeListener('connect', maybeReconnect);

    self.reconnecting = false;

    delete self.reconnectionAttempts;
    delete self.reconnectionDelay;
    delete self.reconnectionTimer;
    delete self.redoTransports;

    self.options['try multiple transports'] = tryMultiple;
  };

  function maybeReconnect () {
    if (!self.reconnecting) {
      return;
    }

    if (self.connected) {
      return reset();
    };

    if (self.connecting && self.reconnecting) {
      return self.reconnectionTimer = setTimeout(maybeReconnect, 1000);
    }


    self.connect();
    self.publish('reconnecting', self.reconnectionDelay, self.reconnectionAttempts);
    self.reconnectionTimer = setTimeout(maybeReconnect, self.reconnectionDelay);

  };

  this.options['try multiple transports'] = false;
  this.reconnectionTimer = setTimeout(maybeReconnect, this.reconnectionDelay);

  this.on('connect', maybeReconnect);
};
