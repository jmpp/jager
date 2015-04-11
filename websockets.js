'use strict';

var _       = require('underscore');
var io      = require('socket.io');
var shortid = require('shortid');

// var Player  = require('./class/Player');

var playersList = [];

// Main controller
// ---------------
function socketsController(server) {
  var ws = io(server);

  // Once a client connect to server
  ws.on('connection', function(socket) {

    // When client sets a new player name
    // ----------------------------------
    socket.on('createPlayer', function createPlayer(name) {
      console.log(
        'New socket from client !'.green,
        'createPlayer()'.magenta,
        ('"' + name.toString() + '"').cyan
      );

      // Check if player already exists within array
      /*var player = _.findWhere(playersList, { name: name });
      if (player)
        return console.error('Name ', name, 'is already taken');*/

      /*playersList.push(new Player(
        shortid.generate(),
        name,

      })*/
      
      var token = shortid.generate();
      playersList.push({
        token: token,
        name : name
      });

      socket.emit('setToken', { token: token });
    });

  });
}

module.exports = socketsController;