'use strict';
/* global module, require, process */

var through2 = require('through2');
var fs = require('fs');
var path = require('path');

function generate(){
  var stream = through2(function(chunk, enc, next){
    this.push(chunk);
    console.log(chunk.toString());
    next();
  }, function(){
    console.log('end');
  });

  var h = html(stream);
  var c = css(stream);
  var j = js(stream);

  h.on('end', function(){
    console.log('end html');
  });
  c.on('end', function(){
    console.log('end css');
  });
  j.on('end', function(){
    console.log('end js');
  });
  return stream;
}

function html(stream){
  var s = fs.createReadStream(path.resolve(process.cwd(), 'template/template.html'));
  s.on('data', function(data){
    stream.write(data);
  });
  return s;
}

function css(stream){
  var s = fs.createReadStream(path.resolve(process.cwd(), 'template/style/index.css'));
  s.on('data', function(data){
    stream.write(data);
  });
  return s;
}

function js(stream){
  var s = fs.createReadStream(path.resolve(process.cwd(), 'template/script/index.js'));
  s.on('data', function(data){
    stream.write(data);
  });
  return s;
}

module.exports = generate;