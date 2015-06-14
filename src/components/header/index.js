require('./header.less');

var _ = require('lodash');
var React = require('react');
var parameterFactory = require('../parameter-factory');

var Header = React.createClass({
  render: function(){
    var that = this;
    var paramNodes = _.map(this.props.params, function(val, key){
      return parameterFactory(key, val, that.setParam);
    }).filter(Boolean);

    return (
      <div className='header'>
        {this.props.children}
        <div className='parameters'>
          {paramNodes}
        </div>
      </div>
    );
  },
  setParam: function(key, val){
    var param = {};
    param[key] = val;
    this.props.setParams(param);
  }
});

module.exports = Header;
