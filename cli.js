#!/usr/bin/env node
'use strict';
/* global require, process */


var meow = require('meow');
var JadeDocHTML = require('./index');
var JSONStream = require('JSONStream');

var cli = meow({
  help: [
    'Usage',
    '  $ jade-doc --input file.jade | jade-doc-html --output file.html',
    '  $ jade-doc-html --input file.json --output file.html',
    '',
    'Options',
    '  --output    Set output html file',
    '  --input     Set input json file',
  ]
});

var jdh = new JadeDocHTML({
  input: cli.flags.input, 
  output: cli.flags.output 
});

process.stdin.pipe(jdh).pipe(JSONStream.stringify()).pipe(process.stdout);

jdh.on('complete', function(){
  process.exit();
});