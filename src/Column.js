Pontos.Column = function(number, height) {
  this.number = number;
  this.bottomDot = null;
  this.init(height);
};

Pontos.Column.prototype.init = function(height) {
  this.bottomDot = this.createDot(0, null, null);
  var currentDot = this.bottomDot;
  for (var i = 1; i < height; i++) {
    currentDot.up = this.createDot(i, currentDot, null);
    currentDot = currentDot.up;
  }
};

Pontos.Column.prototype.getDots = function() {
  var dots = [];
  this.forEachDot(function(dot) {
    dots.push(dot);
  });
  return dots;
};

Pontos.Column.prototype.forEachDot = function(f) {
  var dot = this.bottomDot;
  while (dot) {
    f.call(this, dot);
    dot = dot.up;
  }
};

Pontos.Column.prototype.filterDots = function(f) {
  var dots = [];
  var dot = this.bottomDot;
  while (dot) {
    if (f.call(this, dot)) {
      dots.push(dot);
    }
    dot = dot.up;
  }
  return dots;
};

Pontos.Column.prototype.getDotsBy = function(name, value) {
  return this.filterDots(function(dot) {
    return dot[name] === value;
  });
};

Pontos.Column.prototype.createDot = function(position, down, up) {
  return new Pontos.Dot(this, position, down, up, 'c' + Pontos.Util.getRandomInteger(1, 5));
};

Pontos.Column.prototype.removeDotAt = function(position) {
  var dot = this.getDotsBy('position', position)[0];
  if (dot) {
    if (position === 0) {
      this.bottomDot = dot.up;
    } else {
      if (dot.down !== null) {
        dot.down.up = dot.up;
      }
    }
    if (dot.up !== null) {
      dot.up.down = dot.down;
    }
    this.updatePositions();
  }
};

Pontos.Column.prototype.addDot = function() {
  var height = this.getDots().length;
  var topDot = this.getDotsBy('position', height - 1)[0];
  var newDot = this.createDot(height, topDot, null);
  topDot.up = newDot;
  return newDot;
};

Pontos.Column.prototype.replaceDotAt = function(position) {
  this.removeDotAt(position);
  this.addDot();
};

Pontos.Column.prototype.updatePositions = function() {
  var newPosition = 0;
  this.forEachDot(function(dot) {
    dot.position = newPosition++;
  });
};
