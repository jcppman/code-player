require('../css/solarized_dark.css');
require('../less/app.less');

var url = require('url');
var querystring = require('querystring');
var path = require('path');

var $ = require('jquery');
var _ = require('lodash');

var get = require('./get');
var simpleComposer = require('./composers/simple-composer');
var bassComposer = require('./composers/bass-composer');
var Track = require('./track');
var Instrument = require('./instrument');
var Player = require('./player');
var scales = require('./scales');

$(function(){
  var player;
  var params = _.defaults(parseQuery(), {
    root: 440,
    beatsPerBar: 4,
    bpm: 130,
    melodyScale: 'blues',
    bassScale: 'minorPentatonic'
  });

  // INIT LAYOUT
  var $container = $('#code-container'),
      $header = $('#header');

  if(params.src) {
    load(params.src).then(function(){
      player.play();
    });
  }

  $header.append(require('./elements/status')(params));

  function parseQuery(){
    var camelcase = require('camelcase');
    var parsedUrl = url.parse(location.href, true);
    // all key need to be camelcase, but not all values
    var camelWhitelist = [
      'melody-scale',
      'base-scale'
    ];
    return _.reduce(parsedUrl.query, function(result, val, key){
      result[camelcase(key)] = camelWhitelist.indexOf(key) !== -1 ? camelcase(val) : val;
      return result;
    }, {});
  }

  function load(file){
    var proxy = params.proxy || '';

    return get(proxy + file).then(function(text){
      //compose & play
      var tracks = [
            {
              scale: scales[params.melodyScale] || scales.blues,
              instrument: {
                type: 'square',
                root: params.root
              },
              composer: simpleComposer,
              pan: 0.6
            },
            {
              scale: scales[params.bassScale] || scales.minorPentatonic,
              instrument: {
                type: 'triangle',
                root: params.root
              },
              composer: bassComposer,
              pan: -0.6,
              volume: 0.7
            }
          ];

      player = new Player({
        beatsPerBar: params.beatsPerBar,
        bpm: params.bpm
      });

      var material = text.split('\n');

      tracks.forEach(function(config){
        var track = new Track({
          notes: config.composer(material, {
            scale: config.scale
          }),
          instrument: new Instrument(config.instrument),
          pan: config.pan,
          volume: config.volume,
        });
        player.addTrack(track);
      });

      $container.append(require('./elements/code-viewer')(text, player, params));
    });
  }
});

