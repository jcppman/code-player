var browserify = require('browserify');
var fs = require('fs');

var files = {
  './src/app.js': './app.js',
  './src/index.js': './index.js'
};

var b = browserify(Object.keys(files));

b.transform({
  global: true
}, 'uglifyify');
b.plugin('factor-bundle', {
  outputs: Object.keys(files).map(function(key){
    return files[key];
  })
});

b.bundle().pipe(fs.createWriteStream('./common.js'));
b.on('error', function(e){
  console.log(e);
});
