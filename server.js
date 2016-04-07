'use strict';

var connect = require('connect');
var colors = require('colors');
var serveStatic = require('serve-static');
var PORT = 3000;

connect()
  .use(serveStatic(__dirname)).listen(PORT, () => {
    console.log(`Server running on ${PORT}...http:\/\/localhost:${PORT}/build`.bgGreen);
  });