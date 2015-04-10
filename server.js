'use strict';

require('colors');

var express = require('express');
var http    = require('http');
var morgan  = require('morgan');
var path    = require('path');

var app = express();
var server = http.createServer(app);

app.set('port', process.env.PORT || 1337);

app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

app.use(require('./routes'));

server.listen(app.get('port'), function() {
  console.log('✔ Express server listening on port'.green, app.get('port').toString().cyan);
});