describe('Pontos.ScoreStorage', function() {

  'use strict';

  function buildScoreObjects(scores, date) {
    var out = [];
    for (var i in scores) {
      out.push({
        score: scores[i],
        date: date
      });
    }
    return out;
  }

  it('should save a new score to the list of high scores', function() {
    
    var scoreStorage = new Pontos.ScoreStorage(10, 'test_');
    var date = new Date().getTime();
    
    scoreStorage.setScores([]);
    expect(scoreStorage.getScores()).toEqual([]);

    scoreStorage.saveScore(4, date);
    expect(scoreStorage.getScores()).toEqual(buildScoreObjects([4], date));

    scoreStorage.saveScore(30, date);
    expect(scoreStorage.getScores()).toEqual(buildScoreObjects([30, 4], date));

    scoreStorage.saveScore(8, date);
    expect(scoreStorage.getScores()).toEqual(buildScoreObjects([30, 8, 4], date));
    
    scoreStorage.saveScore(4, date);
    expect(scoreStorage.getScores()).toEqual(buildScoreObjects([30, 8, 4, 4], date));
    
    for (var i = 0; i < 15; i++) {
      scoreStorage.saveScore(i, date);
    }

    expect(scoreStorage.getScores()).toEqual(buildScoreObjects([30, 14, 13, 12, 11, 10, 9, 8, 8, 7], date));
  });

  it('should persist high scores across games', function() {
    
    var gameManager = specHelper.createGameManager(true);
    gameManager.scoreStorage.keyPrefix = 'test_';

    gameManager.scoreStorage.setScores([]);

    gameManager.score.remainingMoves = 0;
    gameManager.score.totalRemovedDots = 4;
    gameManager.finishGame();

    var scores = gameManager.scoreStorage.getScores();
    expect(scores.length).toBe(1);
    expect(scores[0].score).toEqual(4);

    gameManager.restart();

    scores = gameManager.scoreStorage.getScores();
    expect(scores.length).toBe(1);
    expect(scores[0].score).toEqual(4);

  });

});
