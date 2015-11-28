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
  css(stream);
  js(stream);
  stream.end();
  return stream;
}

function html(stream){
  stream.write('html');
}

function css(stream){
  stream.write('css');
}

function js(stream){
  stream.write('js');
}

module.exports = generate;