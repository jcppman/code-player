var xtend = require('xtend');
var Instrument = require('./instrument');
var Rack = require('./rack');
var _ = require('lodash');

function Track(params){
  params = params || {};

  var ctx = require('./audio-engine').context,
      panner = ctx.createStereoPanner(),
      gain = ctx.createGain();

  panner.pan.value = params.pan || 0;
  gain.gain.value = params.volume || 0.5;

  this.instrument = params.instrument || new Instrument();
  this.output = Rack([
    this.instrument.output,
    gain,
    panner
  ]);
  this.notes = params.notes || {};
  this.length = _.result(_.max(this.notes, function(note){
    return note.index;
  }), 'index');
}
Track.prototype = xtend(Track.prototype, {
  play: function(start, end, offset, unit){
    var input = this.instrument.input,
        note,
        length,
        noteStart;
    for(var i=start;i<end;i++){
      note = this.notes[i];
      if(note){
        noteStart = (note.index - start);
        input.write({
          start: offset + noteStart * unit,
          end: offset + (noteStart + note.length) * unit,
          range: note.range,
          note: note.note
        });
      }
    }
  }
});

module.exports = Track;

