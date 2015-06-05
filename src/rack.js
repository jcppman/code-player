var xtend = require('xtend');

function RackFactory(components){

  var len = components.length,
      input = components[0],
      output = components[len -1];

  for(var i = 1; i < len ; i++){
    components[i-1].connect(components[i]);
  }

  input.connect = function(dest){
    output.connect(dest);
  };
  input.disconnect = function(dest){
    output.disconnect(dest);
  };

  return input;
}

module.exports = RackFactory;
