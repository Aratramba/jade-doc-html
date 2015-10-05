'use strict';
/* global module, require, __dirname */

var obj2arr = require('object-array-converter');
var Transform = require('stream').Transform;
var inherits = require('util').inherits;
var assign = require('object-assign');
var pretty = require('pretty');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');



/**
 * Takes the jade-doc stream 
 * and generates a pretty html file.
 */

function JadeDocHTML(options){
  Transform.call(this);

  if(typeof options === 'undefined'){
    throw new Error('Jade doc requires a settings object.');
  }

  if(typeof options.output === 'undefined'){
    throw new Error('Jade doc requires settings.output to be set.');
  }

  // options
  options = assign({
    input: null,
    output: null
  }, options);

  var isInit = true;

  // create output stream
  mkdirp.sync(path.dirname(options.output));
  var output = fs.createWriteStream(options.output);
  output.on('close', function(){
    this.emit('end');
  }.bind(this));


  // read template html file
  var template = fs.createReadStream(__dirname +'/template.html');
  var templateHtml;

  template.on('data', function(data){
    // break template file up in 2 parts
    templateHtml = data.toString().split('JADE_DOC_DATA');

    // add first part of template html
    output.write(templateHtml[0]);
  });



  /**
   * Transform Jade Doc stream
   * add comma's and [ to stream data
   */
  
  this._transform = function(data, enc, done){

    var obj = JSON.parse(data);

    // add variable to expose js object
    if(isInit){
      output.write('[');
    }

    // add trailing comma for all items but the first
    if(!isInit){
      output.write(',');
    }

    // create pretty html
    obj.output = pretty(obj.output);

    // create array of arguments instead of object
    if(obj.meta.arguments){
      obj.meta.arguments = obj2arr.toArray(obj.meta.arguments);
    }

    // push to stream
    output.write(JSON.stringify(obj) +'\n');

    if(isInit){
      isInit = false;
    }

    done();
  };


  /**
   * End of Jade Doc stream
   * append [ 
   */
  
  this._flush = function(done){

    // finish js array
    output.write(']');

    // finish template
    finish();

    // call transform done
    done();
  };


  /**
   * Finish template
   * add last part of template html
   */

  function finish(){
    output.end(templateHtml[1]);
  }


  // if input option was set
  if(typeof options.input !== 'undefined'){

    // read input json
    var input = fs.createReadStream(__dirname +'/'+ options.input);
    input.on('data', function(data){

      // append json data to template
      output.write(data.toString());

      // finish template
      finish.call(this);
    }.bind(this));
  }
  
  return this;
}

inherits(JadeDocHTML, Transform);

module.exports = JadeDocHTML;