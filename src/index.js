var $ = require('jquery');
var hljs = require('highlight.js');

var get = require('./get');
var simpleComposer = require('./composers/simple-composer');
var bassComposer = require('./composers/bass-composer');
var Track = require('./track');
var Instrument = require('./instrument');
var Player = require('./player');

var beatsPerBar = 4;
var bpm = 130;
var player;

// INIT LAYOUT
var $content = $('<pre><code>'),
    $load = $('<button id="load">Load</button>'),
    $play = $('<button id="play">Play</button>'),
    $input = $('<input type="text">'),
    $controls = $('<div>'),
    $cursor = $('<div>'),
    $code;

$controls.append($load);
$controls.append($play);
$play.hide();

$content.append($cursor);
$content.css({
  position: 'relative'
});
$code = $content.find('code');
$cursor.css({
  width: '100%',
  height: '2px',
  position: 'absolute',
  top: '0',
  'background-color': 'red'
});

$input.css({
  width: '100%'
});

$('body').append($controls);
$('body').append($input);
$('body').append($content);

$load.on('click', function(){
  $play.hide();

  var file = $input.val();
  if(!file) return;

  load(file).then(function(){
    $play.show();
  });
});
$play.on('click', function(){
  play();
});

updateCursor();

/*
 * Functions
 */

function load(file){

  var extMatch = file.match(/\.([^\.]*)$/),
      ext = extMatch ? extMatch[1] : '',
      $code = $content.find('code');

  $code.attr('class', ext);
  hljs.highlightBlock($code[0]);

  return get(file).then(function(text){
    $code.text(text);

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

function play(){
  player.play();
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
