'use strict';
/* global module, require, __dirname */

var obj2arr = require('object-array-converter');
var through2 = require('through2');
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

  var isInit = true;

  // create output stream
  mkdirp.sync(path.dirname(options.output));
  var output = fs.createWriteStream(options.output);
  output.on('close', function(){
    stream.emit('complete');
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
   * Create js object to be placed inside html file
   */
  
  function createSnippet(obj){

    var line = [];

    // add trailing comma for all items but the first
    if(!isInit){
      line.push(',');
    }

    // create pretty html
    obj.output = pretty(obj.output);

    // create array of arguments instead of object
    if(obj.meta.arguments){
      obj.meta.arguments = obj2arr.toArray(obj.meta.arguments);
    }

    if(isInit){
      isInit = false;
    }

    line.push(JSON.stringify(obj));

    return line.join('');
    
  }


  /**
   * Output stream
   */

  var stream = through2(function(chunk, enc, next){

    // create code snippet
    var snippet = createSnippet(JSON.parse(chunk));

    // push lines
    output.write(snippet);

    // push stream
    this.push(chunk);
    next();
  });


  /**
   * Input from file
   */
  
  if(typeof options.input !== 'undefined'){

    // read input json
    var input = fs.createReadStream(__dirname +'/'+ options.input);
    input.on('data', function(data){

      var json = JSON.parse(data.toString());

      var snippet;
      json.forEach(function(obj){

        // create code snippet
        snippet = createSnippet(obj);

        // append json data to template
        output.write(snippet);

        // push to output
        stream.push(snippet);
      });

      // write final piece of html
      output.end(templateHtml[1]);

      // end stream
      stream.push(null);
      
    }.bind(this));
  }

  return stream;
}

module.exports = JadeDocHTML;