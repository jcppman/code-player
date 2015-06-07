require('../less/app.less');


var url = require('url');
var querystring = require('querystring');
var path = require('path');

var $ = require('jquery');
var hljs = require('highlight.js');

var get = require('./get');
var simpleComposer = require('./composers/simple-composer');
var bassComposer = require('./composers/bass-composer');
var Track = require('./track');
var Instrument = require('./instrument');
var Player = require('./player');

$(function(){

  var beatsPerBar = 4;
  var bpm = 130;
  var player;

  var query = parseQuery();

  // INIT LAYOUT
  var $content = $('pre'),
      $cursor = $('<div>'),
      $code = $content.find('code');

  $content.css({
    position: 'relative'
  });
  $content.append($cursor);
  $cursor.css({
    width: '100%',
    height: '2px',
    position: 'absolute',
    top: '0',
    'background-color': 'red'
  });

  if(query.src) {
    var ext = path.extname(query.src).replace('.', '');
    $code.addClass('lang-'+ext);
    load(query.src).then(function(){
      player.play();
      updateCursor();
    });
  }

  function parseQuery(){
    var parsedUrl = url.parse(location.href, true);
    return parsedUrl.query;
  }

  function load(file){

    var proxy = query.proxy || '';

    return get(proxy + file).then(function(text){
      $code.text(text);
      hljs.highlightBlock($code[0]);

      var material = text.split('\n');
      player = new Player({
        beatsPerBar: beatsPerBar,
        bpm: bpm
      });

      var melody = new Track({
        notes: simpleComposer(material, {
          scale: require('./scales').blues
        }),
        instrument: new Instrument({
          type: 'square'
        }),
        pan: 0.6
      });
      player.addTrack(melody);

      var bassline = new Track({
        notes: bassComposer(material, {
          scale: require('./scales').minorPentatonic,
          beatsPerBar: beatsPerBar
        }),
        instrument: new Instrument({
          type: 'triangle'
        }),
        pan: -0.5,
        volume: 0.7
      });
      player.addTrack(bassline);
    });
  }

  var frameController = 0;
  function updateCursor(){
    frameController = (frameController+1)%5;

    if(!frameController && player){
      
      var now = player.getCurrentPosition();
      var top = $code.height() * now;
      $cursor.css({
        'transform': 'translateY(' + top + 'px)'
      });
    }
    window.requestAnimationFrame(updateCursor);
  }

});

