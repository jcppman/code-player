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
  if(typeof note === 'number') {
    return note;
  }

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
      offset = -9;
      break;
    case 'C#':
    case 'Db':
      offset = -8;
      break;
    case 'D':
      offset = -7;
      break;
    case 'D#':
    case 'Eb':
      offset = -6;
      break;
    case 'E':
    case 'Fb':
      offset = -5;
      break;
    case 'E#':
    case 'F':
      offset = -4;
      break;
    case 'F#':
    case 'Gb':
      offset = -3;
      break;
    case 'G':
      offset = -2;
      break;
    case 'G#':
    case 'Ab':
      offset = -1;
      break;
  }
  return 440 * Math.pow(2, offset / 12);
}


module.exports = {
  //do not support webkitAudioContext for now
  context: window.AudioContext ? new window.AudioContext() : null,
  freqFactors: factors,
  noteToBase: NoteToBase,
  keys: [ 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#' ],
  scales: {
    chromatic: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ],
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    majorPentatonic: [ 0, 2, 4, 7, 9],
    minorPentatonic: [ 0, 3, 5, 7, 10],
    blues: [ 0, 3, 5, 6, 7, 10],
    phrygian: [0, 1, 3, 5, 7, 8, 10],
    phrygianDominant: [0, 1, 4, 5, 7, 8, 10]
  }
};

