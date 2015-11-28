'use strict';
/* global require */

var Prism = require('prismjs');
var Mustache = require('mustache');

var $cnt = document.getElementsByClassName('container')[0];
var TEMPLATE = document.getElementById('doc-item-template').innerHTML;
var counter = 0;

function display(obj){
  obj.uniqueDocId = ++counter;

  var rendered = Mustache.render(TEMPLATE, obj);
  Mustache.parse(TEMPLATE);
  $cnt.innerHTML += rendered;
  Prism.highlightAll();
}

for(var obj in window.DATA){
  display(window.DATA[obj]);
}