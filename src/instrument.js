var through = require('through2');
var audioEngine = require('./audio-engine');
var factors = audioEngine.freqFactors;

function Instrument(params){
  params = params || {};
  var ctx = audioEngine.context,
      osc = ctx.createOscillator(),
      gate = ctx.createGain(),
      gain = ctx.createGain(),
      input = through.obj(onNote);

  var that = this;
  that.osc = osc;
  that.volume = gain;
  that.gate = gate;
  that.scale = params.scale;
  that.input = input;
  that.output = gain;
  that.setRoot(params.root || 440);

  osc.type = params.type || 'sine';
  gain.gain.value = params.gain || 0.5;
  gate.gain.value = 0;

  osc.connect(gate);
  gate.connect(gain);

  osc.start();

  function onNote(_note, enc, done){
    var range = _note.range,
        start = _note.start,
        end = _note.end,
        rawNote = _note.rawNote,
        frequency,
        note;

    note = that.scale[rawNote % that.scale.length];
    frequency = that.root * factors[range][note];

    gate.gain.setValueAtTime(1, start);
    gate.gain.setValueAtTime(0, end);
    osc.frequency.setValueAtTime(frequency, start - 0.01);

    done();
  }
}

Instrument.prototype.setRoot = function(newRoot){
  var engine = require('./audio-engine');
  this.root = engine.noteToBase(newRoot);
};

module.exports = Instrument;

