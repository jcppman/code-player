var xtend = require('xtend');

function RackFactory(components){

  var len = components.length,
      input = components[0],
      output = components[len -1];

  for(var i = 1; i < len ; i++){
    components[i-1].connect(components[i]);
  }

  return {
    input: input,
    output: output
  };
}

module.exports = RackFactory;
