'use strict';
/* global module, require, process, __dirname */

var JSONStream = require('JSONStream');
var browserify = require('browserify')
var assign = require('object-assign');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');

var snippet = require('./lib/snippet');
var inputFile = require('./lib/input');
var assets = require('./lib/assets');



/**
 * Takes the jade-doc stream 
 * and generates a pretty html file.
 */

function JadeDocHTML(options){

  if(typeof options === 'undefined'){
    throw new Error('Jade doc html requires a settings object.');
  }

  if(typeof options.output === 'undefined'){
    throw new Error('Jade doc html requires settings.output to be set.');
  }

  // options
  options = assign({
    input: null,
    output: null
  }, options);

  // create output stream
  // mkdirp.sync(path.dirname(options.output));
  // var outFile = fs.createWriteStream(options.output);
  // outFile.on('close', function(){
  //   stdout.emit('complete');
  // }.bind(this));
  // 
  

  assets();

  // console.log(html.toString());


  /**
   * Output stream
   */

  var stdout = JSONStream.parse('*');
  stdout.on('data', function(data){
    // outFile.write(snippet.create(data));
  });

  stdout.on('end', function(){
    // outFile.end(html[1]);
  });


  /**
   * Input from file
   */
  
  if(typeof options.input !== 'undefined'){
    // inputFile(options.input, outFile, stdout);
  }

  return stdout;
}

module.exports = JadeDocHTML;