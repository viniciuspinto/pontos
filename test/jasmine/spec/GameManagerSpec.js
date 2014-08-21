describe('Pontos.GameManager', function() {

  'use strict';

  var gameManager = null;
  var eventManager = null;

  beforeEach(function() {
    gameManager = specHelper.createGameManager(false);
    eventManager = gameManager.renderer.eventManager;
  });

  it('should accept custom options', function() {
    var options = {
      filesPath: '../../src/',
      container: specHelper.setupTestGameContainer(),
      width: 123,
      height: 321,
      fitToScreen: true,
      expandBg: true,
      minWidth: 230,
      containerRatio: 1.2,
      board: {
        width: 3,
        height: 7
      },
      moves: 14,
      extras: {
        removeSingle: {
          unlimited: false,
          remaining: 10
        },
        removeColor: {
          unlimited: true,
          remaining: 19
        }
      },
      maxHighScores: 17,
      sayings: ['Hi'],
      tweetText: 'Play this',
      facebookAppId: 991,
      facebookSharedUrl: 'http://example.com/',
      footerContent: 'some text',
      statsHandler: 'stats.jsp',
      infoContent: 'info content',
      autostart: false
    };
    var gm = new Pontos.GameManager(options);
    gm.loadGame();
    expect(gm.options.fitToScreen).toBe(true);
    expect(gm.options.expandBg).toBe(true);
    expect(gm.options.minWidth).toBe(230);
    expect(gm.options.containerRatio).toBe(1.2);
    expect(gm.board.width).toBe(3);
    expect(gm.board.height).toBe(7);
    expect(gm.score.remainingMoves).toBe(14);
    expect(gm.board.extras.removeSingle.unlimited).toBe(false);
    expect(gm.board.extras.removeSingle.remaining).toBe(10);
    expect(gm.board.extras.removeColor.unlimited).toBe(true);
    expect(gm.board.extras.removeColor.remaining).toBe(19);
    expect(gm.scoreStorage.scoreCount).toBe(17);
    expect(gm.options.sayings).toEqual(['Hi']);
    expect(gm.options.tweetText).toEqual('Play this');
    expect(gm.options.facebookAppId).toEqual(991);
    expect(gm.options.facebookSharedUrl).toEqual('http://example.com/');
    expect(gm.options.footerContent).toEqual('some text');
    expect(gm.options.infoContent).toEqual('info content');
    expect(gm.options.statsHandler).toEqual('stats.jsp');
  });

  it('should reset', function() {
    var boardSpy = spyOn(gameManager.board, 'reset');
    gameManager.score.remainingMoves = 1;
    gameManager.score.totalRemovedDots = 7;
    gameManager.stats.closedPaths = 3;
    gameManager.reset();
    expect(gameManager.score.remainingMoves).toBe(gameManager.options.moves);
    expect(gameManager.score.totalRemovedDots).toBe(0);
    expect(gameManager.stats.closedPaths).toBe(0);
    expect(boardSpy).toHaveBeenCalled();
  });

  it('should start the game', function() {
    var now = new Date().getTime();
    expect(gameManager.board.running).toBe(false);
    gameManager.start();
    expect(gameManager.board.running).toBe(true);
    expect(gameManager.gameStartTime).not.toBeLessThan(now);
  });

  it('should restart the game', function() {
    var spyReset = spyOn(gameManager, 'reset');
    var spyStart = spyOn(gameManager, 'start');
    gameManager.restart();
    expect(spyReset).toHaveBeenCalled();
    expect(spyStart).toHaveBeenCalled();
  });

  it('should update score and finish game if no remaining moves', function() {
    var finishSpy = spyOn(gameManager, 'finishGame');
    var notifySpy = spyOn(gameManager.observers, 'notify');

    var score = gameManager.score.totalRemovedDots;
    var moves = gameManager.score.remainingMoves;

    gameManager.updateScoreAndCheckStatus(gameManager.board.getDotAt(0, 0));

    expect(gameManager.score.totalRemovedDots).toBe(score + 1);
    expect(gameManager.score.remainingMoves).toBe(moves - 1);
    expect(notifySpy).toHaveBeenCalledWith('scoreUpdated', gameManager.score);
    expect(finishSpy).not.toHaveBeenCalled();

    gameManager.score.totalRemovedDots = 0;
    gameManager.score.remainingMoves = 1;
    gameManager.updateScoreAndCheckStatus([1, 2]);

    expect(gameManager.score.totalRemovedDots).toBe(2);
    expect(gameManager.score.remainingMoves).toBe(0);
    expect(notifySpy).toHaveBeenCalledWith('scoreUpdated', gameManager.score);
    expect(finishSpy).toHaveBeenCalled();
  });

  it('should finish the game', function() {
    var scoreSpy = spyOn(gameManager.scoreStorage, 'saveScore');
    var statsSpy = spyOn(gameManager, 'sendStats');
    var notifySpy = spyOn(gameManager.observers, 'notify');
    gameManager.start();
    gameManager.finishGame();
    expect(gameManager.board.running).toBe(false);
    expect(scoreSpy).toHaveBeenCalled();
    expect(statsSpy).toHaveBeenCalled();
    expect(notifySpy).toHaveBeenCalledWith('gameFinished', [gameManager.score, gameManager.scoreStorage.getScores()]);
  });

  it('should send stats if there is a stats handler set', function() {
    var jSpy = spyOn($, 'post');
    gameManager.options.statsHandler = null;
    gameManager.sendStats();
    expect(jSpy).not.toHaveBeenCalled();

    gameManager.options.statsHandler = '/stats-handler';
    gameManager.start();
    gameManager.score.totalRemovedDots = 17;
    gameManager.stats.closedPaths = 5;
    gameManager.gameStartTime = 1;
    gameManager.gameEndTime = 3;

    gameManager.sendStats();

    expect(jSpy).toHaveBeenCalledWith('/stats-handler', {
      playedGames: [
        {
          score: 17,
          closedPaths: 5,
          time: 2,
        }
      ]
    });
  });

});
