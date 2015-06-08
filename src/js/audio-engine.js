var factors = (function(){
  var map = {};
  for(var range = -3; range < 4; range++){
    map[range] = {};
    for(var note = 0; note < 12; note++){
      map[range][note] = Math.pow(2, range + (note + 1) / 12);
    }
  }
  return map;
})();

function NoteToBase(note){
  if(typeof note === 'number') return note;

  var offset;
  switch(note){
    case 'A':
      offset = 0;
      break;
    case 'A#':
    case 'Bb':
      offset = 1;
      break;
    case 'B':
    case 'Cb':
      offset = 2;
      break;
    case 'B#':
    case 'C':
      offset = 3;
      break;
    case 'C#':
    case 'Db':
      offset = 4;
      break;
    case 'D':
      offset = 5;
      break;
    case 'D#':
    case 'Eb':
      offset = 6;
      break;
    case 'E':
    case 'Fb':
      offset = 7;
      break;
    case 'E#':
    case 'F':
      offset = 8;
      break;
    case 'F#':
    case 'Gb':
      offset = 9;
      break;
    case 'G':
      offset = 10;
      break;
    case 'G#':
    case 'Ab':
      offset = 11;
      break;
  }

  return 440 * Math.pow(2, offset / 12);
}

module.exports = {
  context: new AudioContext(),
  freqFactors: factors,
  noteToBase: NoteToBase
};

