# Pug-doc HTML

Generates HTML output from a [Pug-doc](http://github.com/Aratramba/pug-doc/) stream or input pug-doc json.


### Command Line
```bash
pug-doc-html --input pug-doc.json --output output.html
```

```bash
pug-doc input.jade | pug-doc-html --output output.html
```


### Node
```js
var stream = new PugDocHTML({
    output: 'output.html',
    input: 'data.json'
});

stream.on('complete', function(){
  console.log('complete');
});
```