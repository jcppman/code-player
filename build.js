var browserify = require('browserify');
var fs = require('fs');

var files = {
  './src/js/app.js': './js/app.js',
  './src/js/index.js': './js/index.js'
};

var b = browserify(Object.keys(files));

b.plugin('factor-bundle', {
  outputs: Object.keys(files).map(function(key){
    return files[key];
  })
});

b.bundle().pipe(fs.createWriteStream('./js/common.js'));
