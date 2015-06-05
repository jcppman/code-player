var START_OFFSET = 1;
var INTERVAL = 100;
var ARRANGE_THRESHOLD = 0.2;
var Rack = require('./rack');
var Reverb = require('soundbank-reverb');
var xtend = require('xtend');

function Player(params){
  params = params || {};
  this.bpm = params.bpm || 120;
  this.beatsPerBar = params.beatsPerBar || 4;
  this.gridDivision = params.gridDivision || 4;
  this.current = 0;
  this.start = 0;
  this.length = 0;
  this.tracks = [];
  this.status = 'stoped';
  this.ctx = require('./audio-engine').context;

  var reverb = new Reverb(this.ctx);
  reverb.dry.value = 1;
  reverb.wet.value = 0.5;

  this.output = Rack([
    reverb
  ]);
  this.output.connect(this.ctx.destination);

  this._updateUnit();
}

Player.prototype = xtend(Player.prototype, {
  getCurrentPosition: function(){
    if(this.status === 'stoped') return 0;
    return Math.max((this.ctx.currentTime - this.start - START_OFFSET), 0) / (this.unit * this.length);
  },
  addTrack: function(track){
    this.tracks.push(track);
    this.length = Math.max(track.length, this.length);
    track.output.connect(this.output);
  },
  play: function(){
    var that = this;

    that.status = 'playing';
    that.arranged = that.start = that.ctx.currentTime;
    that.current = 0;
    arrangeNew();
    
    function arrangeNew(){
      if(that.arranged - that.ctx.currentTime < ARRANGE_THRESHOLD){
        //arrange new 
        that.tracks.forEach(function(track){
          track.play(
            that.current,
            that.current + that.beatsPerBar * that.gridDivision,
            that.arranged + START_OFFSET,
            that.unit
          );
        });

        that.current += that.beatsPerBar * that.gridDivision;
        that.arranged += that.unit * that.beatsPerBar * that.gridDivision;
      }
      
      if(that.current <= that.length){
        setTimeout(arrangeNew, INTERVAL);
      } else {
        that.status = 'stoped';
      }
    }
  },
  setBPM: function(bpm){
    this.bpm = bpm;
    this._updateUnit();
  },
  _updateUnit: function(){
    this.unit = 60 / this.bpm / this.gridDivision;
  }

});

module.exports = Player;

