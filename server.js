'use strict';

require('colors');

var express = require('express');
var http    = require('http');
var morgan  = require('morgan');
var path    = require('path');

var app = express();
global.server = http.createServer(app);

var websocketsController = require('./websockets');

app.set('port', process.env.PORT || 1337);

// app.use('/pilou', function(req, res, next) { console.log('PILOU!'.green); next(); });
app.use('/'      , websocketsController.server);
app.use('/client', websocketsController.client);

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

server.listen(app.get('port'), function() {
  console.log('✔ Express server listening on port'.green, app.get('port').toString().cyan);
});