#!/usr/bin/env node
'use strict';
/* global require, process */

var fs = require('fs');
var Transform = require('stream').Transform;
var inherits = require('util').inherits;
var pretty = require('pretty');
var obj2arr = require('object-array-converter');
var meow = require('meow');
var mkdirp = require('mkdirp');
var path = require('path');


var cli = meow({
  help: [
    'Usage',
    '  $ jade-doc --input file.jade | jade-doc-html --output file.html',
    '',
    'Options',
    '  --output    Set output html file',
  ]
});


/**
 * Create output file
 */

if(typeof cli.flags.output === 'undefined'){
  throw new Error('Jade doc HTML requires --output to be set.');
}

mkdirp.sync(path.dirname(cli.flags.output));
var write = fs.createWriteStream(cli.flags.output);


/**
 * Read template file
 */
var template = fs.createReadStream(__dirname +'/template.html');
var templateHtml;

template.on('data', function(data){
  // break template file up in 2 parts
  templateHtml = data.toString().split('JADE_DOC_DATA');

  // add first part of template html
  write.write(templateHtml[0]);
});


/**
 * Takes the jade-doc stream 
 * and generates a pretty html file.
 */

function JadeDocHTML(){

  Transform.call(this);

  var isInit = true;


  /**
   * Transform Jade Doc stream
   */
  
  this._transform = function(data, enc, done){

    var obj = JSON.parse(data);

    // add variable to expose js object
    if(isInit){
      this.push('var data = [');
    }

    // add trailing comma for all items but the first
    if(!isInit){
      this.push(',');
    }

    // create pretty html
    obj.output = pretty(obj.output);

    // create array of arguments instead of object
    if(obj.meta.arguments){
      obj.meta.arguments = obj2arr.toArray(obj.meta.arguments);
    }

    // push to stream
    this.push(JSON.stringify(obj) +'\n');

    if(isInit){
      isInit = false;
    }

    done();
  };


  /**
   * Finally
   */
  
  this._flush = function(done){

    // finish js array
    this.push('];');

    // add last part of template html
    write.write(templateHtml[1]);

    done();
  };

  return this;
}

inherits(JadeDocHTML, Transform);

process.stdin.pipe(new JadeDocHTML()).pipe(write);