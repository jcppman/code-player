var _ = require('lodash');
var $ = require('jquery');

var paramFilter = [
  'proxy',
  'src'
];

module.exports = function(model){
  var blocks = _.map(_.pick(model, function(val, key){
    return paramFilter.indexOf(key) === -1;
  }), function(val, key){
    return $('<div>')
      .addClass('parameter')
      .html('<b>' + key + '</b>: ' + val);
  });
  var element =  $('<div>');
  return element.addClass('parameters').append.apply(element, blocks);
};
