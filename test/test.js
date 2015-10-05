'use strict';
/* global require */

var test = require('tape');
var JadeDocHTML = require('../');
var fs = require('fs');


/**
 * Dumb test to check if output html is as expected
 */

test('test input / output', function(assert){
  assert.plan(1);

  var options = {
    output: './test/tmp/test.html',
    input: './test/fixtures/data.json'
  };

  var stream = new JadeDocHTML(options);
  stream.on('end', function(){
    var actual = fs.readFileSync(options.output).toString();
    var expected = fs.readFileSync('./test/fixtures/output.html').toString();
    assert.equal(actual, expected, 'output html should be equal to fixture html.');
  });
});
