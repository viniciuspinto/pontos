Pontos.EventManager = function(gameManager) {
  this.gameManager = gameManager;
  this.mouseDownCounter = 0;
};

Pontos.EventManager.prototype.offOn = function(e, el, f) {
  el.off(e).on(e, f);
};

Pontos.EventManager.prototype.attachMainEvents = function() {
  this.disableDrag();
  this.resizeGameWhenWindowSizeChanges();
  this.detectMouseOverDot();
  this.detectClickOnDocument();
  this.detectEndOfTouch();

  this.attachDotsEvents($('.dot'));
  this.attachStatusBarEvents();
  this.detectClickOnExtra();
};

Pontos.EventManager.prototype.attachDotsEvents = function(dots) {
  this.detectMouseOverDot(dots);
  this.detectClickOnDot(dots);
};

Pontos.EventManager.prototype.disableDrag = function() {
  this.gameManager.renderer.gameContainer.off('dragstart').on("dragstart", function() {
    return false;
  });
};

Pontos.EventManager.prototype.resizeGameWhenWindowSizeChanges = function() {
  var self = this;
  $(window).off('resize').on('resize', function() {
    self.gameManager.renderer.setDimensionsAndPositioning(true);
  });
};

Pontos.EventManager.prototype.detectMouseOverDot = function(dots) {
  var self = this;

  if (dots) {
    dots.off('vmouseover').on('vmouseover', function() {
      self.mouseOverDot($(this));
    });
  } else {
    $(document).off('vmousemove').on('vmousemove', function(e) {
      e.preventDefault();
      if (e.originalEvent.originalEvent.touches) {
        var t = e.originalEvent.originalEvent.touches[0];
        var el = document.elementFromPoint(t.clientX, t.clientY);
        self.mouseOverDot($(el));
      }
    });
  }
};

Pontos.EventManager.prototype.detectClickOnDocument = function() {
  var self = this;
  this.offOn('vmousedown', $(document), function(e) {
    if (e.which < 2) {
      self.setMouseDown(true);
    }
  });
};

Pontos.EventManager.prototype.detectClickOnDot = function(dots) {
  var self = this;
  this.offOn('vmousedown', dots, function(e) {
    if (e.which < 2) {
      var dot = self.gameManager.board.getDotById($(this).attr('id'));
      if (dot) {
        self.gameManager.board.handleDotSelectionIntention(dot);
      }
    }
  });
};

Pontos.EventManager.prototype.detectEndOfTouch = function() {
  var self = this;
  this.offOn('vmouseup touchend', $(document), function() {
    self.setMouseDown(false);
    self.gameManager.board.processPlay();
  });
};

Pontos.EventManager.prototype.attachStatusBarEvents = function() {
  var self = this, els = this.gameManager.renderer.elements;
  this.offOn('click', els.statusBar.container.links.newGame.get(), function(e) {
    e.preventDefault();
    self.gameManager.restart();
  });
  this.offOn('click', els.statusBar.container.links.infoLink.get(), function(e) {
    e.preventDefault();
    self.gameManager.renderer.showInfo();
  });
  this.offOn('click', els.gameInfo.container.content.menu.close.get(), function(e) {
    e.preventDefault();
    self.gameManager.renderer.hideInfo();
  });
};

Pontos.EventManager.prototype.detectClickOnExtra = function() {
  var self = this;
  var extraNames = ['removeSingle', 'removeColor'];
  extraNames.forEach(function(extraName) {
    self.offOn('click', self.gameManager.renderer.elements.extras.container[extraName].get(), function(e) {
      e.preventDefault();
      self.gameManager.board.handleExtraClick(extraName);
    });
  });
};

Pontos.EventManager.prototype.attachEndScreenEvents = function() {
  var self = this;
  this.offOn('click', this.gameManager.renderer.elements.endScreen.container.playAgain.get(), function(e) {
    e.preventDefault();
    self.gameManager.restart();
  });

};

Pontos.EventManager.prototype.setMouseDown = function(isDown) {
  this.mouseDownCounter += isDown ? 1 : -1;
  if (this.mouseDownCounter < 0) {
    // avoid issues with left + right clicks and context menus
    this.mouseDownCounter = 0;
  }
};

Pontos.EventManager.prototype.mouseOverDot = function(dotElement) {
  var dot = this.gameManager.board.getDotById(dotElement.attr('id'));
  if (dot && (this.mouseDownCounter > 0)) {
    this.gameManager.board.handleDotSelectionIntention(dot);
  }
};
