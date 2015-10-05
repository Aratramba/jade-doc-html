#!/usr/bin/env node
'use strict';
/* global require, process */


var meow = require('meow');
var jadeDocHTML = require('./index');

var cli = meow({
  help: [
    'Usage',
    '  $ jade-doc --input file.jade | jade-doc-html --output file.html',
    '',
    'Options',
    '  --output    Set output html file',
    '  --input     Set input json file',
  ]
});

process.stdin.pipe(new jadeDocHTML({ 
  input: cli.flags.input, 
  output: cli.flags.output 
}));