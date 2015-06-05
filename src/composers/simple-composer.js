function Compose(material, parameters){
  parameters = parameters || {};
  var rangeStart = parameters.rangeStart || -1,
      rangeEnd = parameters.rangeEnd || 2,
      scale = parameters.scale || require('../scales').major,
      range = rangeEnd - rangeStart,
      gridDivision = parameters.gridDivision || 4,
      notesInScale = scale.length;

  return material.reduce(function(track, line, idx){
      var dried = line.replace(' ', '');
      if(dried.length !== 0) {

        var indent = line.match(/^\s*/),
            transpose = !!indent ? Math.min(indent[0].length / 2, range) : 0,
            value = dried.length % notesInScale,
            braces = line.match(/[\[\]{\(\)}]/g),
            bracesLength = braces ? braces.length : 0;

        var index = idx * gridDivision + (bracesLength % gridDivision);

        track[index] = {
          range: transpose + rangeStart,
          note: scale[value],
          index: index,
          length: gridDivision - bracesLength
        };
      }
      
      return track;
    }, {});
}

module.exports = Compose;

