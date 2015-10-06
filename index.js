'use strict';
/* global module, require, __dirname */

var isEmptyObject = require('is-empty-object');
var assign = require('object-assign');
var through2 = require('through2');
var traverse = require('traverse');
var pretty = require('pretty');
var mkdirp = require('mkdirp');
var marked = require('marked');
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

    obj.name = obj.meta.name;
    obj.description = obj.meta.description;
    // obj.arguments = tableify(obj.meta.arguments);

    delete obj.meta.name;
    delete obj.meta.description;
    // delete obj.meta.arguments;

    // traverse all arguments
    // and indent according to level
    var spaces;
    var arg;
    var rest = '';

    traverse(obj.meta).forEach(function(x){

      // check for empty object
      if(isEmptyObject(x)){
        return;
      }

      if(typeof this.key === 'undefined'){
        return;
      }

      // set indentation
      spaces = new Array(this.level).join('\t');
      arg = [];
      arg.push(spaces);
      arg.push('* ');
      arg.push(this.key);

      if(typeof x !== 'object'){
        arg.push(': ');
        arg.push(x);
      }

      rest += arg.join('') +'\n';
    });

    obj.rest = marked(rest);

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
        
        // push to output
        stream.push(JSON.stringify(obj));

        // create code snippet
        snippet = createSnippet(obj);

        // append json data to template
        output.write(snippet);

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