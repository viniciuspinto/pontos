describe('Pontos.Column', function() {

  var gameManager, column;

  beforeEach(function() {
    gameManager = specHelper.createGameManager();
    specHelper.loadBoardFixture6x6(gameManager.board);
    column = gameManager.board.columns[0];
  });

  it('should create a column', function() {
    var c = new Pontos.Column(3, 6);
    expect(c.number).toBe(3);
    expect(c.getDots().length).toBe(6);
  });

  it('should return all dots', function() {
    var dots = column.getDots();
    expect(dots.length).toBe(6);
    expect(dots[0] instanceof Pontos.Dot).toBe(true);
  });

  it('should filter dots', function() {
    var dots = column.filterDots(function(dot) {
      return (dot.position === 3);
    });
    expect(dots.length).toBe(1);
    expect(dots[0].position).toBe(3);
  });

  it('should get dots by id, position and color', function() {
    var dots = column.getDotsBy('id', 'dot_4');
    expect(dots.length).toBe(1);
    expect(dots[0].id).toBe('dot_4');

    dots = column.getDotsBy('position', 4);
    expect(dots.length).toBe(1);
    expect(dots[0].position).toBe(4);

    dots = column.getDotsBy('color', 'c1');
    expect(dots.length).toBe(2);
    expect(dots[0].color).toBe('c1');
    expect(dots[1].color).toBe('c1');
  });

  it('should iterate over all dots', function() {
    var newPosition = 99;
    column.forEachDot(function(dot) {
      dot.position = newPosition;
    });
    expect(column.getDotsBy('position', 99).length).toBe(6);
  });

  it('should remove a single dot and update dot positions', function() {
    var dot = column.getDotsBy('position', 1);
    column.removeDotAt(1);
    expect(column.getDotsBy('id', dot.id).length).toBe(0);
    expect(column.getDotsBy('position', 0).length).toBe(1);
    expect(column.getDotsBy('position', 1).length).toBe(1);
    expect(column.getDotsBy('position', 2).length).toBe(1);
    expect(column.getDotsBy('position', 3).length).toBe(1);
    expect(column.getDotsBy('position', 4).length).toBe(1);
    expect(column.getDotsBy('position', 5).length).toBe(0);
    column.removeDotAt(0);
    expect(column.getDots().length).toBe(4);
  });

  it('should add a new dot at the top', function() {
    column.addDot();
    expect(column.getDots().length).toBe(7);
    var dots = column.getDotsBy('position', 6);
    expect(dots.length).toBe(1);
    expect(dots[0].up).toBe(null);
  });

  it('should replace a dot', function() {
    var dotToBeReplaced  = column.getDotsBy('position', 0)[0];
    var dotAboveReplaced = column.getDotsBy('position', 1)[0];
    column.replaceDotAt(0);
    
    expect(column.getDots().indexOf(dotToBeReplaced)).toBe(-1);
    expect(column.getDotsBy('position', 0)[0]).toBe(dotAboveReplaced);
  });

});
