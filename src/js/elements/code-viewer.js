var $ = require('jquery');
var hljs = require('highlight.js');

module.exports = function(text, player, config){
  var $content = $('<pre>'),
      $cursor = $('<div>'),
      $code = $('<code>');

  $content.append($cursor);
  $content.append($code);
  $cursor.css({
    width: '100%',
    height: '2px',
    position: 'absolute',
    top: '0',
    'z-index': 999,
    'background-color': 'red'
  });

  //display codes
  $code.text(text);
  hljs.highlightBlock($code[0]);

  var frameController = 0;
  updateCursor();

  return $content;

  function updateCursor(){
    var $container = $content.parent();

    frameController = (frameController+1)%5;

    if(!frameController && $container && player){
      
      var now = player.getCurrentPosition();
      var current = $code.height() * now;
      var cursorOffset, contentOffset;
      if(current > $container.height() / 2) {
        cursorOffset = $container.height() / 2;
        contentOffset = cursorOffset - current;
      } else {
        cursorOffset = current;
        contentOffset = 0;
      }
      $cursor.css({
        'transform': 'translateY(' + cursorOffset + 'px)'
      });
      $code.css({
        'transform': 'translateY(' + contentOffset + 'px)'
      });
    }
    window.requestAnimationFrame(updateCursor);
  }
};
