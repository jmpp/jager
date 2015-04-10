'use strict';

var io = require('socket.io');

var singleton = function socketsController(server) {
  if (singleton.sockets)
    return;
  
  var ws = io(server);
  singleton.sockets = ws.sockets;

  // URL for client : /socket.io/socket.io.js

  // Once a client connect to server
  ws.on('connection', function(socket) {

    socket.on('createPlayer', createPlayer);

  });
};

// When client sets a new player name
function createPlayer(name) {
  console.log('New socket from client !'.green, 'createPlayer()'.magenta, name.toString().cyan);
}

module.exports = singleton;