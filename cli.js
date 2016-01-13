#!/usr/bin/env node
'use strict';
/* global require, process */


var meow = require('meow');
var PugDocHTML = require('./index');
var JSONStream = require('JSONStream');

var cli = meow({
  help: [
    'Usage',
    '  $ pug-doc --input file.jade | pug-doc-html --output file.html',
    '  $ pug-doc-html --input file.json --output file.html',
    '',
    'Options',
    '  --output    Set output html file',
    '  --input     Set input json file',
  ]
});

var jdh = new PugDocHTML({
  input: cli.flags.input, 
  output: cli.flags.output 
});

process.stdin.pipe(jdh).pipe(JSONStream.stringify()).pipe(process.stdout);

jdh.on('complete', function(){
  process.exit();
});