# Jade-doc HTML

Generates HTML output from a [Jade-doc](http://github.com/Aratramba/jade-doc/) stream or input jade-doc json.


### Command Line
```bash
jade-doc-html --input jade-doc.json --output output/
```

```bash
jade-doc input.jade | jade-doc-html --output output/
```


### Node
```js
var jdh = new JadeDocHTML({
    output: 'output/',
    input: '/path/to/data.json'
});

jdh.on('complete', function(){
  console.log('complete');
});
```