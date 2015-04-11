'use strict';

require('colors');

var express = require('express');
var http    = require('http');
var morgan  = require('morgan');
var path    = require('path');

var app = express();
global.server = http.createServer(app);
global.debug = process.argv[2] === '--debug';

app.set('port', process.env.PORT || 1337);

app.use(require('./websockets'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

server.listen(app.get('port'), function() {
  console.log('✔ Express server listening on port'.green, app.get('port').toString().cyan);
});