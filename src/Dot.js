Pontos.Dot = function(column, position, down, up, color) {

  this.id = 'dot_' + Pontos.Dot.getNextDotNumber();
  this.column = column;
  this.position = position;
  this.down = down;
  this.up = up;
  this.color = color;
  this.rendered = false;
  this.animated = false;

};

Pontos.Dot.getNextDotNumber = function() {
  if (!Pontos.Dot.nextDotNumber) {
    Pontos.Dot.nextDotNumber = 1;
  }
  return Pontos.Dot.nextDotNumber++;
};
