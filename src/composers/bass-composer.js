function Compose(material, parameters){
  parameters = parameters || {};
  var rangeStart = parameters.rangeStart || -2,
      rangeEnd = parameters.rangeEnd || 1,
      scale = parameters.scale || require('../scales').major,
      range = rangeEnd - rangeStart,
      gridDivision = parameters.gridDivision || 4,
      beatsPerBar = parameters.beatsPerBar || 4,
      notesInScale = scale.length,
      result = {};

  material.forEach(function(line, idx){
    if(idx % beatsPerBar !== 0) return;

    var indentRes = line.match(/^\s*/),
        indent = indentRes ? indentRes[0].length : 0,
        index = idx * gridDivision;

    result[index] = {
      range: rangeStart,
      note: scale[Math.floor(indent/2) % notesInScale],
      index: index,
      length: gridDivision * beatsPerBar
    };
  });
  return result;
}

module.exports = Compose;

