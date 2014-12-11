$.fx.off = true;
Pontos.Animator.skipAnimation = true;

var specHelper = {

  template: '<div id="pontos-container"><div class="status-bar"><div class="container"><div class="info"><span class="remaining-moves">remaining: <span class="value"></span></span> / <span class="score">score: <span class="value"></span></span></div><div class="links"><a href="#" class="new-game">NEW</a> <a href="#" class="info-link">INFO</a></div></div></div><div class="extras"><div class="container"><a href="#" class="remove-single extra" data-extra="removeSingle">REMOVE ONE</a> <a href="#" class="remove-color extra" data-extra="removeColor">REMOVE COLOR</a></div></div><div class="end-screen"><div class="container"><p class="message">You scored <span class="points"></span> points!</p><p class="play-again"><a href="#">Play Again!</a></p><p class="share"><span class="twitter"><a class="link" ref="#" target="_blank" data-twitter-url="https://twitter.com/intent/tweet?text=">Tweet this score</a></span> <span class="facebook"><iframe class="iframe" src="" width="100" height="80"></iframe></span></p><div class="high-scores"><h3>High Scores</h3><ul class="list"></ul><li class="score-template"><div class="score"></div><div class="date"></div></li></div></div></div><div class="board"><div class="container"></div></div><div class="board-bg"><div class="container"></div></div><div class="game-info"><div class="container"><div class="content"><p class="menu"><a href="#" class="close">(close info)</a></p></div></div></div><div class="footer"><div class="container"></div></div><div class="dot-template"></div><div class="size-warning"><div class="content">Sorry, this screen is too small to play the game.</div></div></div>',

  createGameManager: function(start) {
    start = typeof start == 'boolean' ? start : true;
    var gm = Pontos.GameManager.load({
      filesPath: '../../src/',
      container: specHelper.setupTestGameContainer(),
      template: this.template,
      autostart: start,
      tweetText: 'Sample tweet'
    });
    return gm;
  },

  setupTestGameContainer: function() {
    var container = $('#pontos');
    if (container.length < 1) {
      container = $('<div id="pontos"></div>');
      container.appendTo('body');
    }
    container.html('');
    return container;
  },

  makeClosedPathSelection: function(board) {
    var dots = [board.getDotAt(0, 0), 
                board.getDotAt(0, 1), 
                board.getDotAt(1, 1), 
                board.getDotAt(1, 0), 
                board.getDotAt(0, 0)];
    var color = dots[0].color;
    for (var i = 0; i < dots.length; i++) {
      dots[i].color = color;
      board.handleDotSelectionIntention(dots[i]);
    }
    return { dots: dots, color: color};
  },

  loadBoardFixture6x6: function(board) {
    var dot,
        counter = 1,
        colors = [
          ['c1', 'c2', 'c2', 'c5', 'c3', 'c1'],
          ['c5', 'c5', 'c2', 'c3', 'c2', 'c6'],
          ['c6', 'c4', 'c3', 'c1', 'c2', 'c6'],
          ['c2', 'c5', 'c4', 'c2', 'c3', 'c1'],
          ['c2', 'c2', 'c4', 'c5', 'c4', 'c3'],
          ['c3', 'c1', 'c6', 'c5', 'c6', 'c2']
        ]
    for (var i = 0; i < 6; i++) {
      for (var j = 0; j < 6; j++) {
        dot = board.getDotAt(i, j);
        dot.id = 'dot_' + counter;
        dot.color = colors[i][j];
        counter++;
      }
    }
  }

};


