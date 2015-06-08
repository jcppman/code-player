require('../css/solarized_dark.css');
require('../less/app.less');

var querystring = require('querystring');
var $ = require('jquery');

var get = require('./get');
var simpleComposer = require('./composers/simple-composer');
var bassComposer = require('./composers/bass-composer');
var Track = require('./track');
var Instrument = require('./instrument');
var Player = require('./player');
var scales = require('./scales');

$(function(){
  var player;
  var params = require('./parameters');

  // INIT LAYOUT
  var $container = $('#code-container'),
      $header = $('#header'),
      $back = $('#back');

  if(params.src) {
    load(params.src).then(function(){
      player.play();
    });
  }

  $header.append(require('./elements/status')(params));

  function load(file){
    var proxy = params.proxy || '';

    return get(proxy + file).then(function(text){
      var engine = require('./audio-engine');
      var root = engine.noteToBase(params.root);
      //compose & play
      var tracks = [
            {
              scale: scales[params.melodyScale] || scales.blues,
              instrument: {
                type: 'square',
                root: root
              },
              composer: simpleComposer,
              pan: 0.6
            },
            {
              scale: scales[params.bassScale] || scales.minorPentatonic,
              instrument: {
                type: 'triangle',
                root: root
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

