require('./solarized_dark.css');
require('./code-viewer.less');

var hljs = require('highlight.js');

var React = require('react');

var Codes = React.createClass({
  render: function(){
    return (
      <pre style={this.props.style}><code ref="textContainer">{this.props.text}</code></pre>
    );
  },
  componentDidMount: function(){
    hljs.highlightBlock(React.findDOMNode(this.refs.textContainer));
  }
});

var CodeViewer = React.createClass({
  getInitialState: function(){
    return {
      cursorOffset: 0,
      codeOffset: 0
    };
  },
  render: function(){
    if(!this.props.text) {
      return null;
    }

    return (
      <div className="code-viewer">
        <Codes text={this.props.text} style={transform(this.state.codeOffset)} ref="codes"/>
        <div className="cursor" style={transform(this.state.cursorOffset)}></div>
      </div>
    );

    function transform(offset){
      return {
        transform: 'translateY(' + offset + 'px)'
      };
    }
  },
  componentWillReceiveProps: function(newProps){
    var me = React.findDOMNode(this);
    var codes = React.findDOMNode(this.refs.codes);
    if(me && codes) {
      var offset = newProps.current * codes.clientHeight;
      var cursorOffset = Math.min(me.clientHeight / 2, offset);
      var codeOffset = cursorOffset - offset;
      this.setState({
        cursorOffset: cursorOffset,
        codeOffset: codeOffset
      });
    }
  }
});

module.exports = CodeViewer;

