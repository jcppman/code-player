require('./parameter.less');

var audioEngine = require('../../audio-engine');
var React = require('react');

var Parameter = React.createClass({
  render: function(){
    return (
      <div className="parameter">
        <b>{this.props.name}:</b> {this.props.val}
        <div className="options">
          {this.props.children}
        </div>
      </div>
    );
  }
});

var RangeParameter = React.createClass({
  render: function(){
    return (
      <Parameter name={this.props.name} val={this.props.val}>
        <input
          ref="range"
          type="range"
          value={this.props.val}
          onChange={this.change}
          max={this.props.end}
          min={this.props.start} />
      </Parameter>
    );
  },
  change: function(){
    var value = React.findDOMNode(this.refs.range).value;
    this.props.setParam(this.props.name, value);
  }
});

var SetParameter = React.createClass({
  render: function(){
    var that = this;
    var options = that.props.options.map(function(value, id){
      return (
        <div key={id} className="option" onClick={that.select} data-value={value}>{value}</div>
      );
    });
    return (
      <Parameter name={that.props.name} val={that.props.val}>
        {options}
      </Parameter>
    );
  },
  select: function(e){
    var value = e.target.dataset.value;
    this.props.setParam(this.props.name, value);
  }
});

function getComponent(type, val, setParam){
  var component;
  switch(type){
    case 'root':
      component = (
        <SetParameter
          key={type}
          options={audioEngine.keys}
          name={type}
          val={val}
          setParam={setParam} />
      );
      break;
    case 'melodyScale':
    case 'bassScale':
      component = (
        <SetParameter
          key={type}
          options={Object.keys(audioEngine.scales)}
          name={type}
          val={val}
          setParam={setParam} />
      );
      break;
    case 'beatsPerBar':
      component = (
        <RangeParameter
          key={type}
          name={type}
          val={val}
          start={3}
          end={5}
          setParam={setParam} />
      );
      break;
    case 'bpm':
      component = (
        <RangeParameter
          key={type}
          name={type}
          val={val}
          start={50}
          end={250}
          setParam={setParam} />
      );
      break;
    default:
      component = null;
  }
  return component;
}

module.exports = getComponent;
