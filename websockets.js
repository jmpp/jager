'use strict';

var _       = require('underscore');
var io      = require('socket.io');
var path    = require('path');
var shortid = require('shortid');

var server = global.server;
var DEBUG  = global.debug;

var ws = io(server);
var serverSocketId;
var playersList = []; // [{ socketId, token, name }]

// Websockets controller
// ---------------------
function socketsController(req, res, next) {

  if (req.url !== '/' && req.url !== '/client')
    return next();

  ws.on('connection', function(socket) {

    // Server view
    socket.on('setServer', function setServer(data) {
      if (serverSocketId)
        return;

      DEBUG && console.log('--> setServer()'.blue);
      serverSocketId = socket.id;
    });

    // New player request
    socket.on('createPlayer', function createPlayer(data) {

      // Player name already exists ?
      var player = _.findWhere(playersList, { name: data.name });
      if (player) {
        DEBUG && console.error('Name '.red, data.name, 'is already taken'.red);
        return socket.emit('nameIsTaken', 1);
      }

      DEBUG && console.log('--> createPlayer('.cyan + data.name.toString().magenta +')'.cyan);
      var token = shortid.generate();

      playersList.push({ socketId: socket.id, token: token, name: data.name });

      // Sending its token to the new player
      socket.emit('setToken', { token: token });
      DEBUG && console.log('<-- setToken('.cyan + token.magenta +')'.cyan);

      // Sending new player socket to the server view
      socket.to(serverSocketId).emit('addPlayer', { token: token, name: data.name });
      DEBUG && console.log('<-- addPlayer('.cyan + token.magenta, data.name.magenta +')'.cyan);
      DEBUG && console.log('-------------'.cyan);
    });

    // Move player request
    socket.on('movePlayer', function movePlayer(data) {
      // expects data to be like { token, x, y }

      var player = _.findWhere(playersList, { token: data.token });
      if (!player)
        return;

      // Sending the position to the server view
      socket.to(serverSocketId).emit('movePlayer', data);
      DEBUG && console.log('<-- movePlayer('.blue + (data.token + ' ' + data.x + ' ' + data.y).magenta + ')'.blue);
    });

    // Disconnection
    socket.on('disconnect', function() {
      // Server disconnect
      if (socket.id === serverSocketId) {
        serverSocketId = null;
        return ws.sockets.emit('serverDisconnected', 1);
      }

      // Player disconnect
      var player = _.findWhere(playersList, { socketId: socket.id });

      if (player) {
        _.without(playersList, _.findWhere(playersList, {token: player.token}));
        socket.to(serverSocketId).emit('disconnectPlayer', { token: player.token });
      }

    });
  });

  next();

}

module.exports = socketsController;