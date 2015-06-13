function Compose(material, parameters){
  parameters = parameters || {};
  var rangeStart = parameters.rangeStart || -2,
      gridDivision = parameters.gridDivision || 4,
      beatsPerBar = parameters.beatsPerBar || 4,
      result = {};

  material.forEach(function(line, idx){
    if(idx % beatsPerBar !== 0) {
      return;
    }

    var indentRes = line.match(/^\s*/),
        indent = indentRes ? indentRes[0].length : 0,
        index = idx * gridDivision;

    result[index] = {
      range: rangeStart,
      rawNote: Math.floor(indent / 2),
      index: index,
      length: gridDivision * beatsPerBar
    };
  });
  return result;
}

module.exports = Compose;

