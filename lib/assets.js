'use strict';
/* global module, require */

var through2 = require('through2');

function generate(){
  var stream = through2(function(chunk, enc, next){
    console.log(chunk.toString());
    this.push(chunk);
    next();
  });

  html(stream);
  return stream;
}

function html(stream){
  stream.push('foo');
}

module.exports = generate;