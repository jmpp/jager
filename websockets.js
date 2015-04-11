'use strict';

var _       = require('underscore');
var io      = require('socket.io');
var shortid = require('shortid');

var server = global.server;
var ws = io(server);
var socketServer;

// Middleware for server view socket exchange
// ------------------------------------------
function socketsControllerServer(req, res, next) {
  console.log("in middleware socketsControllerServer()".blue);

  ws.on('connection', function(socket) {
    socketServer = socket;
  })

  next();
}

// Middleware for client view socket exchange
// ------------------------------------------
function socketsControllerClient(req, res, next) {
  console.log("in middleware socketsControllerClient()".cyan);
  ws.on('connection', function(socket) {
    // New player request
    socket.on('createPlayer', function createPlayer(name) {
      console.log('--> createPlayer('.cyan + name.toString().magenta +')'.cyan);

      var token = shortid.generate();

      // Sending its token to the new player
      socket.emit('setToken', { token: token });
      console.log('<-- setToken('.cyan + token.magenta +')'.cyan);

      // Sending new player socket to the server view
      socketServer.emit('addPlayer', { token: token, name: name });
      console.log('<-- addPlayer('.cyan + token.magenta, name.magenta +')'.cyan);
    })

    // Move player request
    socket.on('movePlayer', function movePlayer(data) {
      // expects data to be like { token, position: {x, y} }

      // Sending the position to the server view
      socketServer.emit('movePlayer', data);
      console.log('<-- movePlayer('.blue + (data.position.x +' '+ data.position.y).magenta +')'.blue);
    })
  })

  next();
}

module.exports = {
  server: socketsControllerServer,
  client: socketsControllerClient
};