'use strict';
/* global module, require */

var marked = require('marked');
var pretty = require('pretty');
var isEmptyObject = require('is-empty-object');
var traverse = require('traverse');


/**
 * Create js object to be placed inside html file
 */

var isInit = true;

function createSnippet(obj){

  var line = [];

  // add trailing comma for all items but the first
  if(!isInit){
    line.push(',');
  }

  obj = JSON.parse(JSON.stringify(obj));

  // create pretty html
  obj.output = pretty(obj.output);

  obj.name = obj.meta.name;
  obj.description = obj.meta.description;

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

    if(this.key === 'name'){
      return;
    }

    if(this.key === 'description'){
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

  line.push(JSON.stringify(obj));

  isInit = false;
  
  return line.join('');
  
}

module.exports = {
  create: createSnippet
};
