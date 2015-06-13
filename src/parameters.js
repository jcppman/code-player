var _ = require('lodash');
var url = require('url');

function parseQuery(href){
  var camelcase = require('camelcase');
  var parsedUrl = url.parse(href, true);
  // all key need to be camelcase, but not all values
  var camelWhitelist = [
    'melody-scale',
    'bass-scale'
  ];
  return _.defaults(
    _.reduce(parsedUrl.query, function(result, val, key){
      result[camelcase(key)] = camelWhitelist.indexOf(key) !== -1 ? camelcase(val) : val;
      return result;
    }, {}),
    // defaults
    {
      root: 'A',
      beatsPerBar: 4,
      bpm: 130,
      melodyScale: 'blues',
      bassScale: 'minorPentatonic'
    });
}

module.exports = parseQuery(location.href);

