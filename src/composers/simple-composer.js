function Compose(material, parameters){
  parameters = parameters || {};
  var rangeStart = parameters.rangeStart || -2,
      rangeEnd = parameters.rangeEnd || 2,
      range = rangeEnd - rangeStart,
      gridDivision = parameters.gridDivision || 4;

  return material.reduce(function(track, line, idx){
      var dried = line.replace(' ', '');
      if(dried.length !== 0) {

        var indent = line.match(/^\s*/),
            transpose = indent ? Math.min(indent[0].length / 2, range) : 0,
            braces = line.match(/[\[\]{\(\)}]/g),
            bracesAmount = braces ? braces.length % gridDivision : 0;

        var index = idx * gridDivision + bracesAmount;

        track[index] = {
          range: transpose + rangeStart,
          rawNote: dried.length,
          index: index,
          length: gridDivision - bracesAmount
        };
      }

      return track;
    }, {});
}

module.exports = Compose;

