Pontos.Board = function(width, height, extras) {

  this.width = width;
  this.height = height;
  this.originalExtras = extras;

  this.observers = new Pontos.ObserverCollection([
    'dotSelection',
    'dotRemove',
    'specialPlayExecuted',
    'extraStatusChange',
    'performedClosedPath',
    'finishedProcessingExtra'
  ]);

};

Pontos.Board.dotsAreAdjascent = function(a, b) {
  return ((a.position === b.position && Math.abs(b.column.number - a.column.number) === 1) || 
          (a.column.number === b.column.number && Math.abs(b.position - a.position) === 1));
};

Pontos.Board.prototype.reset = function() {
  this.running = false;
  this.columns = [];
  this.selectedDots = [];
  this.colorSelectedForRemoval = null;
  this.extras = $.extend(true, {}, this.originalExtras);

  for (var name in this.extras) {
    if (this.extras.hasOwnProperty(name)) {
      this.extras[name].active = false;
      this.extras[name].disabled = false;
    }
  }

  this.create();
};

Pontos.Board.prototype.create = function() {
  this.columns = [];
  for (var i = 0; i < this.width; i++) {
    this.columns.push(new Pontos.Column(i, this.height));
  }
};

Pontos.Board.prototype.getAllDots = function() {
  var dots = [];
  this.columns.forEach(function(column) {
    column.getDots().forEach(function(dot) {
      dots.push(dot);
    });
  });
  return dots;
};

Pontos.Board.prototype.getDotAt = function(column, position) {
  return this.columns[column].getDotsBy('position', position)[0];
};

Pontos.Board.prototype.getDotById = function(id) {
  var dot;
  for (var i in this.columns) {
    dot = this.columns[i].getDotsBy('id', id)[0];
    if (dot) {
      return dot;
    }
  }
};

Pontos.Board.prototype.selectDot = function(dot) {
  this.selectedDots.push(dot);
  this.observers.notify('dotSelection', [dot, true]);
};

Pontos.Board.prototype.isDotSelected = function(dot) {
  return (this.selectedDots.indexOf(dot) !== -1);
};

Pontos.Board.prototype.lastSelectedDot = function() {
  if (this.selectedDots.length > 0) {
    return this.selectedDots[this.selectedDots.length - 1];
  }
};

Pontos.Board.prototype.shouldSelectDot = function(dot) {
  if (!this.isDotSelected(dot)) {
    var lastSelectedDot = this.lastSelectedDot();
    if (!lastSelectedDot || ((dot.color === lastSelectedDot.color) && Pontos.Board.dotsAreAdjascent(dot, lastSelectedDot))) {
      return true;
    }
  }
  return false;
};

Pontos.Board.prototype.getDotsByColor = function(color) {
  var dots = [];
  for (var i in this.columns) {
    dots = dots.concat(this.columns[i].getDotsBy('color', color));
  }
  return dots;
};

Pontos.Board.prototype.deselectAllDots = function() {
  this.observers.notify('dotSelection', [this.selectedDots, false]);
  this.selectedDots = [];
};

Pontos.Board.prototype.removeDot = function(dot, shouldNotify) {
  this.columns[dot.column.number].replaceDotAt(dot.position);
  if (shouldNotify !== false) {
    this.observers.notify('dotRemove', dot);
  }
};

Pontos.Board.prototype.handleDotSelectionIntention = function(dot) {

  if (this.running) {

    if (this.extras.removeSingle.active) {
      return this.executeExtraRemoveSingle(dot);
    } else if (this.extras.removeColor.active) {
      return this.executeExtraRemoveColor(dot.color);
    }

    var self = this;

    if (this.isDotSelected(dot)) {
      var selectedIndex = this.selectedDots.indexOf(dot);

      var sameColorDots = this.getDotsByColor(dot.color);
      var unselectedSameColorDots = sameColorDots.filter(function(dot) {
        return !self.isDotSelected(dot);
      });

      if (this.colorSelectedForRemoval && selectedIndex === (this.selectedDots.length - 1)) {
        // reopens path (don't deselect any dot, just remove active class from unselected dots)
        this.colorSelectedForRemoval = null;
        this.observers.notify('dotSelection', [unselectedSameColorDots, false]);
      } else if (selectedIndex === (this.selectedDots.length - 2)) {
        // deselects last selected dot
        this.colorSelectedForRemoval = null;
        this.observers.notify('dotSelection', [this.selectedDots.pop(), false]);
      } else {
        if (!this.colorSelectedForRemoval && Pontos.Board.dotsAreAdjascent(dot, this.lastSelectedDot())) {
          // closes path
          this.observers.notify('dotSelection', [unselectedSameColorDots, true]);
          this.colorSelectedForRemoval = dot.color;
        }
      }
    } else {
      if (this.shouldSelectDot(dot)) {
        this.selectDot(dot);
      }
    }

  }

};

Pontos.Board.prototype.processPlay = function() {
  if (this.running) {
    if (this.colorSelectedForRemoval) {
      this.selectDotsByColor(this.colorSelectedForRemoval);
      this.colorSelectedForRemoval = null;
    }
    if (this.selectedDots.length >= 2) {
      this.removeSelectedDots();
    }
    this.deselectAllDots();
  }
};

Pontos.Board.prototype.selectDotsByColor = function(color) {
  var dots = this.getDotsByColor(color);
  for (var i = 0; i < dots.length; i++) {
    if (!this.isDotSelected(dots[i])) {
      this.selectDot(dots[i]);
    }
  }
  if (!this.extras.removeColor.active) {
    this.observers.notify('performedClosedPath');
  }
  return this.selectedDots;
};

Pontos.Board.prototype.removeSelectedDots = function(isExecutingExtra) {
  for (var i = 0; i < this.selectedDots.length; i++) {
    this.removeDot(this.selectedDots[i], false);
  }
  this.observers.notify('dotRemove', [this.selectedDots]);
  if (this.selectedDots.length > 6 || isExecutingExtra) {
    this.observers.notify('specialPlayExecuted');
  }
  this.deselectAllDots();
};

Pontos.Board.prototype.handleExtraClick = function(clickedExtraName) {
  for (var name in this.extras) {
    if (name !== clickedExtraName) {
      this.extras[name].active = false;
    }
  }
  if (this.extras[clickedExtraName].active) {
    this.extras[clickedExtraName].active = false;
  } else {
    if (this.extras[clickedExtraName].unlimited || this.extras[clickedExtraName].remaining > 0) {
      this.extras[clickedExtraName].active = true;
    }
  }
  this.observers.notify('extraStatusChange', this.extras);
};

Pontos.Board.prototype.processExecutedExtra = function(extraName) {
  if (!this.extras[extraName].unlimited) {
    this.extras[extraName].remaining--;
    if (this.extras[extraName].remaining < 1) {
      this.extras[extraName].disabled = true;
    }
  }
  this.extras[extraName].active = false;
  this.observers.notify('finishedProcessingExtra', this.extras);
};

Pontos.Board.prototype.shouldExecuteExtra = function(extra) {
  return ((this.extras[extra].unlimited || this.extras[extra].remaining > 0) && 
            this.extras[extra].disabled === false);
};

Pontos.Board.prototype.executeExtraRemoveSingle = function(dot) {
  if (this.shouldExecuteExtra('removeSingle')) {
    this.selectDot(dot);
    this.removeSelectedDots();
    this.processExecutedExtra('removeSingle');
  }
};

Pontos.Board.prototype.executeExtraRemoveColor = function(color) {
  if (this.shouldExecuteExtra('removeColor')) {
    this.selectDotsByColor(color);
    this.removeSelectedDots(true);
    this.processExecutedExtra('removeColor');
  }
};
