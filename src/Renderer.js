Pontos.Renderer = function(options, eventManager) {

  this.options = options;
  this.eventManager = eventManager;

  this.dimensions = {
    width:  options.width || options.container.width(),
    height: options.height || options.container.height()
  };

  this.shouldRenderSaying = (Modernizr.cssanimations && this.options.sayings.length > 0);
  this.gameContainer = null;
  this.elements = {};

  this.observers = new Pontos.ObserverCollection([
    'gameRendered',
    'dotsRendered',
    'endScreenRendered'
  ]);

  this.observers.add('gameRendered',      this.eventManager, this.eventManager.attachMainEvents);
  this.observers.add('dotsRendered',      this.eventManager, this.eventManager.attachDotsEvents);
  this.observers.add('endScreenRendered', this.eventManager, this.eventManager.attachEndScreenEvents);

  if (this.options.tweetText) {
    $.getScript('//platform.twitter.com/widgets.js');
  }

};

Pontos.Renderer.prototype.renderGame = function(gameManager) {

  var self = this;
  this.board = gameManager.board;

  if (!this.options.template) {
    this.loadTemplateThenRenderGame(gameManager, gameManager.options.filesPath + 'template_main.html');
  } else {

    this.options.container.html(this.options.template);
    this.gameContainer = $('#pontos-container', this.options.container);
    this.elements = this.createElementsMap(this.gameContainer);
    this.elements.dots = {
      get: function() {
        return $('.dot', self.gameContainer);
      }
    };

    this.elements.gameContainer = this.gameContainer;
    this.elements.boardBg.get().css('opacity', 0);

    this.renderInfo();
    this.renderDots();
    this.renderScore(gameManager.score);
    this.renderFooter();

    this.setDimensionsAndPositioning();
    this.observers.notify('gameRendered');

    this.board.getAllDots().forEach(function(dot) {
      self.animateDot(dot, self.getDotById(dot.id), Pontos.Animator.getDefaultDotAnimator());
    });

  }

};

Pontos.Renderer.prototype.loadTemplateThenRenderGame = function(gameManager, path) {
  var self = this;
  $.get(path)
    .done(function(data) {
      if (data) {
        self.options.template = data;
        self.renderGame(gameManager);
      } else {
        self.renderErrorLoading();
      }
    })
    .fail(function(jqXHR, textStatus) {
      console.log(textStatus);
      self.renderErrorLoading();
    });
};

Pontos.Renderer.prototype.renderErrorLoading = function() {
  alert('Error loading the game. Please try refreshing the page.');
};

Pontos.Renderer.prototype.renderInfo = function() {
  if (this.options.infoContent) {
    this.elements.gameInfo.container.content.get().append(this.options.infoContent);
  } else {
    this.elements.statusBar.container.links.infoLink.get().remove();
  }
};

Pontos.Renderer.prototype.renderDots = function() {
  var self = this;
  this.board.getAllDots().forEach(function(dot) {
    self.renderDot(dot);
  });
};

Pontos.Renderer.prototype.renderDot = function(dot) {
  var dotElement;
  if (dot.rendered === false) {
    dotElement = $('.dot-template', this.gameContainer).clone().removeClass('dot-template').addClass('dot');
    dotElement.attr('id', dot.id);
    dotElement.addClass('color-' + dot.color);
    this.elements.board.container.get().append(dotElement);
    return dotElement;
  } else {
    return this.getDotById(dot.id);
  }
};

Pontos.Renderer.prototype.renderScore = function(score) {
  $('.value', this.elements.statusBar.container.info.remainingMoves.get()).text(score.remainingMoves);
  $('.value', this.elements.statusBar.container.info.score.get()).text(score.totalRemovedDots);
};

Pontos.Renderer.prototype.renderFooter = function() {
  if (this.options.footerContent) {
    this.elements.footer.get().html(this.options.footerContent);
  }
};

Pontos.Renderer.prototype.setDimensionsAndPositioning = function(forceNoAnimation) {
  var self = this;
  this.setGameContainerDimensions();
  this.calculateBoardDimensions();
  this.board.getAllDots().forEach(function(dot) {
    self.adjustSizeAndPositionOfDot(dot, self.getDotById(dot.id), forceNoAnimation);
  });
  this.setFontSizes();
};

Pontos.Renderer.prototype.setFontSizes = function() {
  var currentWidth = parseInt(this.elements.board.container.get().css('width'), 10);
  var percentage = (currentWidth * 100) / 400;
  this.gameContainer.css('fontSize', percentage + '%');
};

Pontos.Renderer.prototype.setGameContainerDimensions = function() {

  var viewportWidth  = viewportSize.getWidth();
  var viewportHeight = viewportSize.getHeight();

  if (!this.dimensions.width && !this.dimensions.height) {
    this.setWidth(this.options.minWidth);
  } else {
    if (this.dimensions.width) {
      this.setWidth(this.dimensions.width);
    } else if (this.dimensions.height) {
      this.setHeight(this.dimensions.height);
    }
  }

  var containerRatio  = this.dimensions.width / this.dimensions.height;
  if (containerRatio > this.options.containerRatio) {
    this.setHeight(this.dimensions.height);
  } else if (containerRatio < this.options.containerRatio) {
    this.setWidth(this.dimensions.width);
  }

  if (this.options.fitToScreen) {
    this.setWidth(viewportWidth);
    this.fitDimensionsToScreen();
  }

  if (this.dimensions.width < this.options.minWidth) {
    this.setWidth(this.options.minWidth);
  }

  // Check if dimensions fit viewport
  if (this.dimensions.width > viewportWidth || this.dimensions.height > viewportHeight) {
    this.renderWarningScreenTooSmall(true);
  } else {

    this.renderWarningScreenTooSmall(false);

    // Apply width
    this.elements.statusBar.container.get().css('width', this.dimensions.width);
    this.elements.extras.container.get().css('width', this.dimensions.width);
    this.elements.board.container.get().css('width', this.dimensions.width);
    this.elements.boardBg.container.get().css('width', this.dimensions.width);
    this.elements.gameInfo.container.get().css('width', this.dimensions.width);
    this.elements.endScreen.container.get().css('width', this.dimensions.width);
    this.elements.footer.container.get().css('width', this.dimensions.width);

    this.gameContainer.css('height', this.dimensions.height);

    if (this.options.expandBg) {
      this.gameContainer.css('height', viewportHeight);
    } else {
      this.elements.gameContainer.css('width', this.dimensions.width);
    }

  }
};

Pontos.Renderer.prototype.renderWarningScreenTooSmall = function(tooSmall) {
  this.elements.sizeWarning.get().css('display', (tooSmall ? 'block' : 'none'));
};

Pontos.Renderer.prototype.fitDimensionsToScreen = function() {
  var screenWidth  = viewportSize.getWidth();
  var screenHeight = viewportSize.getHeight();

  if (this.dimensions.width > screenWidth) {
    this.dimensions.setWidth(screenWidth);
  }
  
  if (this.dimensions.height > screenHeight) {
    this.setHeight(screenHeight);
  }
};

Pontos.Renderer.prototype.setWidth = function(w) {
  this.dimensions.width = w;
  this.dimensions.height = Math.ceil(this.dimensions.width / this.options.containerRatio);
};

Pontos.Renderer.prototype.setHeight = function(h) {
  this.dimensions.height = h;
  this.dimensions.width = Math.ceil(this.dimensions.height * this.options.containerRatio);
};

Pontos.Renderer.prototype.calculateBoardDimensions = function() {
  this.dimensions.boardElementWidth  = parseInt(this.elements.board.container.get().css('width'), 10);
  this.dimensions.boardLateralMargin = Math.ceil(0.05 * this.dimensions.boardElementWidth);

  this.dimensions.dotOuterWidth  = Math.ceil((this.dimensions.boardElementWidth - (2 * this.dimensions.boardLateralMargin)) / this.board.width);
  this.dimensions.dotWidth       = Math.ceil(0.60 * this.dimensions.dotOuterWidth);
  this.dimensions.dotBorderWidth = Math.ceil(0.10 * this.dimensions.dotOuterWidth);
  this.dimensions.dotMargin      = Math.ceil(0.05 * this.dimensions.dotOuterWidth);
};

Pontos.Renderer.prototype.getDotFinalTopPosition = function(dot) {
  return ((this.board.height - dot.position - 1) * this.dimensions.dotOuterWidth);
};

Pontos.Renderer.prototype.adjustSizeAndPositionOfDot = function(dot, dotElement, forceNoAnimation) {
  var finalTopPosition, positionOffset;
  if (dot.rendered === false || forceNoAnimation) {
    dotElement.css('width', this.dimensions.dotWidth);
    dotElement.css('height', this.dimensions.dotWidth);
    dotElement.css('margin', this.dimensions.dotMargin);
    dotElement.css('borderWidth', this.dimensions.dotBorderWidth);

    positionOffset = (forceNoAnimation ? 0 : parseInt(this.gameContainer.css('height'), 10));

    finalTopPosition = this.getDotFinalTopPosition(dot);

    dotElement.css('top', finalTopPosition - positionOffset);
    dotElement.css('left', this.dimensions.boardLateralMargin + (dot.column.number * this.dimensions.dotOuterWidth));
  }
};

Pontos.Renderer.prototype.animateDot = function(dot, dotElement, animator) {
  var self = this;
  dotElement.show();
  animator.initialPosition = parseInt(dotElement.css('top'), 10);
  if (dot.animated) {
    animator.positionOffset = this.getDotFinalTopPosition(dot) - parseInt(dotElement.css('top'), 10);
  } else {
    animator.positionOffset = parseInt(this.gameContainer.css('height'), 10);
  }
  animator.callback = function(top) {
    dotElement.css('top', top);
  };
  animator.animate();
  dot.animated = true;
  dot.rendered = true;
};

Pontos.Renderer.prototype.renderEndScreen = function(score, highScores) {
  var self = this;
  this.elements.extras.container.get().css('visibility', 'hidden');
  this.elements.board.container.get().fadeOut(400, function() {
    $(this).remove();
    self.elements.endScreen.container.message.points.get().text(score.totalRemovedDots);
    
    // Sharing links
    if (self.options.tweetText) {
      var twitterLink = self.elements.endScreen.container.share.twitter.link.get();
      twitterLink.attr('href', twitterLink.data('twitter-url') + encodeURIComponent(self.getTweetText(score.totalRemovedDots)));
      self.elements.endScreen.container.share.twitter.get().show();
    }

    if (self.options.facebookAppId && self.options.facebookSharedUrl) {
      var iframe = self.elements.endScreen.container.share.facebook.iframe.get();
      iframe.attr('src', 'http://www.facebook.com/plugins/like.php?href=' + encodeURIComponent(self.options.facebookSharedUrl) + '&width&layout=button&action=like&show_faces=true&share=true&height=80&appId=' + self.options.facebookAppId);
      self.elements.endScreen.container.share.facebook.get().show();
    }

    self.renderHighScores(highScores);
    self.elements.boardBg.get().css('opacity', 1);
    self.elements.endScreen.get().show();

    self.observers.notify('endScreenRendered');
  });
};

Pontos.Renderer.prototype.getTweetText = function(score) {
  if (typeof this.options.tweetText === 'string') {
    return this.options.tweetText.replace('<!score>', score);
  }
  return '';
};

Pontos.Renderer.prototype.renderHighScores = function(highScores) {
  if (highScores instanceof Array && highScores.length > 0) {
    var scoresList = this.elements.endScreen.container.highScores.list.get();
    var scoreItemElement;
    var scoreItemTemplate = this.elements.endScreen.container.highScores.scoreTemplate.get();
    highScores = highScores.splice(0, 5);
    for (var i in highScores) {
      scoreItemElement = scoreItemTemplate.clone();
      $('.score', scoreItemElement).text(highScores[i].score);
      $('.date', scoreItemElement).text(this.getFormattedDateForScore(highScores[i].date));
      scoreItemElement.css('display', 'block');
      scoresList.append(scoreItemElement);
    }
    this.elements.endScreen.container.highScores.get().css('display', 'block');
  } else {
    this.elements.endScreen.container.highScores.get().css('display', 'none');
  }
};

Pontos.Renderer.prototype.getFormattedDateForScore = function(time) {
  var date = new Date();
  date.setTime(time);
  return Pontos.Util.getWeekdayName(date.getDay()) + ', ' + Pontos.Util.getMonthName(date.getMonth()) + ' ' + 
          date.getDate() + Pontos.Util.getOrdinalSuffix(date.getDate());
};

Pontos.Renderer.prototype.renderColumnFromPositionUp = function(columnNumber, startPosition) {
  var dot, dotElement, ids = [], dots = this.board.columns[columnNumber].getDots();
  for (var i in dots) {
    if (dots[i].position >= startPosition) {
      dot = dots[i];
      ids.push(dot.id);
      dotElement = this.renderDot(dot);
      this.adjustSizeAndPositionOfDot(dot, dotElement);
      this.animateDot(dot, dotElement, Pontos.Animator.getDefaultDotAnimator());
    }
  }
  this.observers.notify('dotsRendered', $('#' + ids.join(', #')));
};

Pontos.Renderer.prototype.getDotById = function(id) {
  return $('#' + id, this.gameContainer);
};

Pontos.Renderer.prototype.removeDots = function(dots) {

  var i, dot, columnsToRenderFromPosition = [];

  if (!$.isArray(dots)) {
    dots = [dots];
  }

  for (i = 0; i < this.board.width; i++) {
    columnsToRenderFromPosition[i] = this.board.height + 1;
  }

  for (i = 0; i < dots.length; i++) {
    dot = dots[i];
    this.getDotById(dots[i].id).remove();
    if (dot.position < columnsToRenderFromPosition[dot.column.number]) {
      columnsToRenderFromPosition[dot.column.number] = dot.position;
    }
  }

  // animate columns
  for (i = 0; i < this.board.width; i++) {
    if (columnsToRenderFromPosition[i] < this.board.height) {
      this.renderColumnFromPositionUp(i, columnsToRenderFromPosition[i]);
    }
  }

};

Pontos.Renderer.prototype.renderDotsSelection = function(dots, selected) {
  var dot, activeClass = 'dot-active';
  if (!$.isArray(dots)) {
    dots = [dots];
  }
  for (var i = 0; i < dots.length; i++) {
    dot = this.getDotById(dots[i].id);
    if (dot) {
      if (selected) {
        dot.addClass(activeClass);
      } else {
        dot.removeClass(activeClass);
      }
    }
  }
  this.elements.boardBg.get().css('opacity', $('.dot-active').length / 6);
};

Pontos.Renderer.prototype.renderExtraStatuses = function(extras) {
  var el, activeClass = 'active', disabledClass = 'disabled';
  for (var name in extras) {
    var extra = extras[name];
    el = this.elements.extras.container[name].get();
    if (extra.disabled) {
      el.addClass(disabledClass);
    } else {
      if (extra.active) {
        el.addClass(activeClass);
      } else {
        el.removeClass(activeClass);
      }
    }
  }
};

Pontos.Renderer.prototype.renderExtraDisabled = function(extra) {
  this.elements.extras.container[extra].get().attr('disabled', true).addClass('disabled');
};

Pontos.Renderer.prototype.showInfo = function() {
  this.elements.gameInfo.get().show();
};

Pontos.Renderer.prototype.hideInfo = function() {
  this.elements.gameInfo.get().hide();
};

Pontos.Renderer.prototype.renderSaying = function() {
  if (this.shouldRenderSaying) {
    var s = this.options.sayings[Pontos.Util.getRandomInteger(0, this.options.sayings.length - 1)];
    this.elements.board.container.get().append('<p class="saying animated zoomOutUp">' + s + '</p>');
  }
};

Pontos.Renderer.prototype.createElementsMap = function(parent) {
  var map = {}, key, subMap, self = this;
  $.each(parent.children(), function(i, el) {
    el = $(el);
    key = el.attr('class');
    if (key) {
      key = Pontos.Util.toCamelCase(key.split(' ')[0]);
      map[key] = {
        get: function() {
          return el;
        }
      };
      subMap = self.createElementsMap(el);
      for (var k in subMap) {
        map[key][k] = subMap[k];
      }
    }
  });
  return map;
};
