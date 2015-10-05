# Jade-doc HTML

Generates HTML output from a [Jade-doc](http://github.com/Aratramba/jade-doc/) stream or input jade-doc json.


### Command Line
```bash
jade-doc input.jade | jade-doc-html --output output.html
jade-doc input.jade | jade-doc-html --output output.html --input jade-doc.json
```


### Node
```js
var jadeDocHtml = new JadeDocHTML({
    output: 'output.html',
    input: 'data.json'
});

jadeDocHtml.on('end', function(){
  console.log('complete');
});
```