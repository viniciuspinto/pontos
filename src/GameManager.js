Pontos.GameManager = function(options) {

  this.options = $.extend(true, {}, Pontos.GameManager.DEFAULT_OPTIONS);
  $.extend(true, this.options, options);

  this.score   = {};
  this.stats   = {};

  this.gameStartTime = null;
  this.gameEndTime = null;

  this.board = null;
  this.renderer = null;
  this.scoreStorage = null;

  this.observers = new Pontos.ObserverCollection(['resetGame', 'scoreUpdated', 'gameFinished']);

};

Pontos.GameManager.DEFAULT_OPTIONS = {
  filesPath: './',
  container: null,
  template: null,
  width: null,
  height: null,
  fitToScreen: false,
  expandBg: false,
  minWidth: 100,
  containerRatio: 0.85,
  board: {
    width: 6,
    height: 6
  },
  moves: 30,
  extras: {
    removeSingle: {
      unlimited: true,
      remaining: 0
    },
    removeColor: {
      unlimited: false,
      remaining: 1
    }
  },
  maxHighScores: 10,
  sayings: [],
  tweetText: null,
  facebookAppId: null,
  facebookSharedUrl: '',
  footerContent: '',
  statsHandler: '',
  infoContent: '',
  autostart: true
};

Pontos.GameManager.load = function(options) {
  var game = new Pontos.GameManager(options);
  game.loadGame();
  return game;
};

Pontos.GameManager.prototype.loadGame = function() {
  this.board = new Pontos.Board(this.options.board.width, this.options.board.height, this.options.extras);
  this.renderer = new Pontos.Renderer(this.options, new Pontos.EventManager(this));
  this.scoreStorage = new Pontos.ScoreStorage(this.options.maxHighScores);

  this.board.observers.add('dotSelection',        this.renderer, this.renderer.renderDotsSelection);
  this.board.observers.add('dotRemove',           this,          this.updateScoreAndCheckStatus);
  this.board.observers.add('dotRemove',           this.renderer, this.renderer.removeDots);
  this.board.observers.add('specialPlayExecuted', this.renderer, this.renderer.renderSaying);
  this.board.observers.add('performedClosedPath', this,          this.incrementClosedPathsCount);
  this.board.observers.add('extraStatusChange',   this.renderer, this.renderer.renderExtraStatuses);
  this.board.observers.add('finishedProcessingExtra', this.renderer, this.renderer.renderExtraStatuses);

  this.observers.add('resetGame', this.renderer, this.renderer.renderGame);
  this.observers.add('scoreUpdated', this.renderer, this.renderer.renderScore);
  this.observers.add('gameFinished', this.renderer, this.renderer.renderEndScreen);

  this.reset();

  if (this.options.autostart) {
    this.start();
  }
};

Pontos.GameManager.prototype.reset = function() {
  this.board.reset();
  this.resetScore();
  this.resetStats();
  this.observers.notify('resetGame', this);
};

Pontos.GameManager.prototype.start = function() {
  this.gameStartTime = new Date().getTime();
  this.gameEndTime = null;
  this.board.running = true;
};

Pontos.GameManager.prototype.restart = function() {
  this.reset();
  this.start();
};

Pontos.GameManager.prototype.resetScore = function() {
  this.score = {
    remainingMoves: this.options.moves,
    totalRemovedDots: 0
  };
};

Pontos.GameManager.prototype.resetStats = function() {
  this.stats = {
    closedPaths: 0
  };
};

Pontos.GameManager.prototype.updateScoreAndCheckStatus = function(removedDots) {
  this.score.totalRemovedDots += ($.isArray(removedDots) ? removedDots.length : 1);
  this.score.remainingMoves -= 1;
  this.observers.notify('scoreUpdated', this.score);

  if (this.score.remainingMoves < 1) {
    this.finishGame();
  }
};

Pontos.GameManager.prototype.finishGame = function() {
  this.board.running = false;
  this.gameEndTime = new Date().getTime();
  this.scoreStorage.saveScore(this.score.totalRemovedDots, this.gameEndTime);
  this.sendStats();
  this.observers.notify('gameFinished', [this.score, this.scoreStorage.getScores()]);
};

Pontos.GameManager.prototype.incrementClosedPathsCount = function() {
  this.stats.closedPaths++;
};

Pontos.GameManager.prototype.sendStats = function() {
  if (this.options.statsHandler) {
    var stats = {
      playedGames: [
        {
          score: this.score.totalRemovedDots,
          closedPaths: this.stats.closedPaths,
          time: this.gameEndTime - this.gameStartTime
        }
      ]
    };
    $.post(this.options.statsHandler, stats);
  }
};
