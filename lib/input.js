'use strict';
/* global module, require, process */

var snippet = require('./snippet');

var fs = require('fs');

function inputFile(file, outFileStream, stdout){

  // read input json
  var input = fs.createReadStream(process.cwd() +'/'+ file);
  input.on('data', function(data){

    var json = JSON.parse(data.toString());
    json.forEach(function(obj){

      // append json data to template
      outFileStream.write(snippet.create(obj));

    });

    // end stream
    stdout.push(null);
    stdout.end();
    
  });
}

module.exports = inputFile;