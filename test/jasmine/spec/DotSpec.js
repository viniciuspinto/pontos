describe('Pontos.Dot', function() {

  'use strict';

  it('should create dots', function() {
    var column = { number: 5 },
        position = 3, 
        down = { id: 1 }, 
        up = { id: 2 }, 
        color = 'red';

    var dot = new Pontos.Dot(column, position, down, up, color);

    expect(dot.id).toMatch(/dot_[0-9]{1,}/);
    expect(dot.column).toBe(column);
    expect(dot.position).toBe(position);
    expect(dot.down).toBe(down);
    expect(dot.up).toBe(up);
    expect(dot.color).toBe(color);
  });

  it('should set the correct dot id', function() {
    var dot = new Pontos.Dot();
    var numberId = parseInt(dot.id.replace('dot_', ''), 10);
    dot = new Pontos.Dot();
    expect(dot.id).toBe('dot_' + (numberId + 1));
  });

});
