require('./index.less');

var EventEmitter = require('events').EventEmitter;
var querystring = require('querystring');
var xtend = require('xtend');

var React = require('react');
var Header = require('./components/header');

var bus = new EventEmitter();

var UrlInput = React.createClass({
  render: function(){
    return (
      <div>
        <div className="url-input">
          <input value={this.props.src} type="url" ref="url" placeholder="Source code url" onChange={this.onChange}/>
          <button className="submit" onClick={this.go}>Go!</button>
        </div>
        <small className="cors-tip">Please make sure the source is cors-enabled, if not, use <a href="https://crossorigin.me/">CrossOrigin.me</a> to wrap it first.</small>
      </div>
    );
  },
  onChange: function(){
    var input = React.findDOMNode(this.refs.url);
    bus.emit('setParams', {
      src: input.value
    });
  },
  go: function(){
    bus.emit('go');
  }
});

var Settings = React.createClass({
  render: function(){
    return (
      <div className="settings">
        <Header params={this.props.params} setParams={this.setParams}/>
      </div>
    );
  },
  setParams: function(params){
    bus.emit('setParams', params);
  }
});

var Entry = React.createClass({
  getInitialState: function(){
    var params = require('./parameters');
    params.src = params.src || 'https://raw.githubusercontent.com/jcppman/code-player/master/src/app.js';
    return {
      params: params
    };
  },
  render: function(){
    return (
      <div className="entry">
        <div className="title">
          <h1>Code Sonata</h1>
          <p className="sub">Your codes should <span className="wrong">speak</span> sing for themselves</p>
        </div>
        <UrlInput src={this.state.params.src} />
        <Settings params={this.state.params} />
      </div>
    );
  },
  componentDidMount: function(){
    var that = this;
    bus.on('setParams', function(params){
      that.setState({
        params: xtend(that.state.params, params)
      });
    });
    bus.on('go', function(){
      var url = 'app.html?' + querystring.stringify(that.state.params);
      window.location = url;
    });
  }
});

React.render(
  <Entry />,
  document.getElementById('container')
);
