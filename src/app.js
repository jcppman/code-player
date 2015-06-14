require('./app.less');

var LOOP_INTERVAL = 4000;

var React = require('react');
var _ = require('lodash');

var get = require('./get');
var simpleComposer = require('./composers/simple-composer');
var bassComposer = require('./composers/bass-composer');
var Track = require('./track');
var Instrument = require('./instrument');
var Player = require('./player');
var scales = require('./audio-engine').scales;

var App = React.createClass({
  getInitialState: function(){
    return {
      text: '',
      current: 0,
      player: null,
      params: require('./parameters')
    };
  },
  render: function(){
    var Header = require('./components/header');
    var CodeViewer = require('./components/code-viewer');
    return (
      <div className="player">
        <Header params={this.state.params} setParams={this.setParams}>
          <h1><a href="/">Code Player</a></h1> <a href="https://github.com/jcppman/code-player">Explain it to me</a>
        </Header>
        <CodeViewer
          text={this.state.text}
          current={this.state.current} />
      </div>
    );
  },
  setParams: function(newParams){
    var params = _.assign(this.state.params, newParams);
    this.setState({
      params: params
    });

    //dirty re-assignments
    var player = this.state.player;
    player.setBPM(params.bpm);
    player.beatsPerBar = params.beatsPerBar;

    var melody = player.tracks[0].instrument;
    var bass = player.tracks[1].instrument;
    melody.setRoot(params.root);
    bass.setRoot(params.root);
    melody.scale = scales[params.melodyScale];
    bass.scale = scales[params.bassScale];
  },
  componentDidMount: function(){
    var that = this,
        params = that.state.params,
        src = params.src,
        proxy = params.proxy || '';

    if(!src) {
      return;
    }

    var player = new Player({
      beatsPerBar: params.beatsPerBar,
      bpm: params.bpm
    });
    that.setState({
      player: player
    });

    get(proxy + src).then(function(text){
      //compose & play
      var tracks = [
        {
          instrument: {
            type: 'square',
            root: params.root,
            scale: scales[params.melodyScale] || scales.blues
          },
          composer: simpleComposer,
          pan: 0.6
        },
        {
          instrument: {
            type: 'triangle',
            root: params.root,
            scale: scales[params.bassScale] || scales.minorPentatonic
          },
          composer: bassComposer,
          pan: -0.6,
          volume: 0.7
        }
      ];

      var material = text.split('\n');

      tracks.forEach(function(config){
        var track = new Track({
          notes: config.composer(material),
          instrument: new Instrument(config.instrument),
          pan: config.pan,
          volume: config.volume
        });
        player.addTrack(track);
      });

      //update state
      that.setState({
        text: text
      });

      //make it loooop
      player.play();
      player.on('end', function(){
        setTimeout(function(){
          player.play();
        }, LOOP_INTERVAL);
      });

      //update current
      var frameModerator = 0;
      theLoop();

      function theLoop(){
        frameModerator = (frameModerator + 1) % 5;
        if(!frameModerator) {
          that.updateCurrent();
        }
        window.requestAnimationFrame(theLoop);
      }
    });
  },
  updateCurrent: function(){
    this.setState({
      current: this.state.player.getCurrentPosition()
    });
  }
});

React.render(
  <App />,
  document.getElementById('code-player')
);

