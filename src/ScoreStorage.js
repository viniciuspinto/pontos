Pontos.ScoreStorage = function(scoreCount, keyPrefix) {
  this.scores = [];
  this.scoreCount = scoreCount;
  this.keyPrefix = keyPrefix || '';
};

Pontos.ScoreStorage.COOKIE_KEY = 'high_scores';
Pontos.ScoreStorage.COOKIE_SCORE_SEPARATOR = '|';
Pontos.ScoreStorage.COOKIE_VALUE_SEPARATOR = '@';
Pontos.ScoreStorage.COOKIE_EXPIRES = 60 * 60 * 24 * 365; // 1 year

Pontos.ScoreStorage.prototype.saveScore = function(score, date) {
  this.scores = this.getScores();
  this.scores.push({
    score: score,
    date: date
  });
  this.scores.sort(this.sort);
  this.setScores(this.scores.splice(0, this.scoreCount));
};

Pontos.ScoreStorage.prototype.getScores = function() {
  this.scores = [];
  var rawScores = [], cookieValue = Cookies.get(this.getCookieKey()) || '';
  if (cookieValue.length > 0) {
    rawScores = cookieValue.split(Pontos.ScoreStorage.COOKIE_SCORE_SEPARATOR);
    for (var i in rawScores) {
      this.scores.push(this.parseRawScore(rawScores[i]));
    }
  }
  return this.scores;
};

Pontos.ScoreStorage.prototype.parseRawScore = function(score) {
  var data = score.split(Pontos.ScoreStorage.COOKIE_VALUE_SEPARATOR);
  return {
    score: parseInt(data[0], 10),
    date: parseInt(data[1], 10)
  };
};

Pontos.ScoreStorage.prototype.createRawScore = function(score) {
  return score.score + Pontos.ScoreStorage.COOKIE_VALUE_SEPARATOR + score.date;
};

Pontos.ScoreStorage.prototype.setScores = function(scores) {
  var rawScores = [];
  for (var i in scores) {
    rawScores.push(this.createRawScore(scores[i]));
  }
  Cookies.set(this.getCookieKey(), rawScores.join(Pontos.ScoreStorage.COOKIE_SCORE_SEPARATOR), {
    expires: Pontos.ScoreStorage.COOKIE_EXPIRES
  });
};

Pontos.ScoreStorage.prototype.sort = function(a, b) {
  return b.score - a.score;
};

Pontos.ScoreStorage.prototype.getCookieKey = function() {
  return this.keyPrefix + Pontos.ScoreStorage.COOKIE_KEY;
};
