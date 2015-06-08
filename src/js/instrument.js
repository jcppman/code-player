var through = require('through2');
var xtend = require('xtend');

var factors = {};

(function(map){
  for(var range = -3; range < 4; range++){
    map[range] = {};
    for(var note = 0; note < 12; note++){
      map[range][note] = Math.pow(2, range + (note + 1) / 12);
    }
  }
})(factors);

function Instrument(params){
  params = params || {};
  var ctx = require('./audio-engine').context,
      osc = ctx.createOscillator(),
      gate = ctx.createGain(),
      gain = ctx.createGain(),
      input = through.obj(onNote);

  var that = this;
  that.osc = osc;
  that.volume = gain;
  that.gate = gate;
  that.root = params.root || 440;
  that.input = input;
  that.output = gain;

  osc.type = params.type || 'sine';
  gain.gain.value = params.gain || 0.5;
  gate.gain.value = 0;

  osc.connect(gate);
  gate.connect(gain);

  osc.start();
  
  function onNote(_note, enc, done){
    var length = _note.length,
        range = _note.range,
        start = _note.start,
        end = _note.end,
        note = _note.note,
        frequency;

    frequency = that.root * factors[range][note];

    gate.gain.setValueAtTime(1, start);
    gate.gain.setValueAtTime(0, end);
    osc.frequency.setValueAtTime(frequency, start - 0.01);

    done();
  }
}

module.exports = Instrument;

