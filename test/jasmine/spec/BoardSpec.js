describe('Pontos.Board', function() {

  'use strict';

  var gm;

  beforeEach(function() {
    gm = specHelper.createGameManager(true);
  });

  it('should reset the board', function() {
    var extras = { removeSingle: 10, removeColor: 3 };
    var board = new Pontos.Board(7, 8, extras);
    board.reset();

    expect(board.width).toBe(7);
    expect(board.height).toBe(8);
    expect(board.running).toBe(false);
    expect(board.selectedDots.length).toBe(0);
    expect(board.colorSelectedForRemoval).toBe(null);
    expect(board.extras).toEqual(extras);

    board.selectDot(board.getDotAt(0, 0));
    board.colorSelectedForRemoval = 'red';
    var columns = board.columns;
    board.reset();

    expect(board.width).toBe(7);
    expect(board.height).toBe(8);
    expect(board.running).toBe(false);
    expect(board.selectedDots.length).toBe(0);
    expect(board.colorSelectedForRemoval).toBe(null);
    expect(board.extras).toEqual(extras);
    expect(board.columns).not.toBe(columns);
  });

  it('should have the correct number of dots', function() {
    var board = new Pontos.Board(10, 15);
    board.reset();
    expect(board.width).toBe(10);
    expect(board.height).toBe(15);
    expect(board.columns.length).toBe(board.width);
    expect(board.columns[0].getDots().length).toBe(board.height);
    expect(board.columns[9].getDots().length).toBe(board.height);
  });

  it('should get all board dots', function() {
    var dots = gm.board.getAllDots();
    expect(dots.length).toBe(36);
    expect(dots[0] instanceof Pontos.Dot).toBe(true);
  });

  it('should get dot by id or position', function() {
    var correctDot = gm.board.columns[0].getDotsBy('position', 0)[0];
    expect(correctDot instanceof Pontos.Dot).toBe(true);
    expect(correctDot.id).not.toBeFalsy();
    expect(gm.board.getDotAt(0, 0)).toBe(correctDot);
    expect(gm.board.getDotById(correctDot.id)).toBe(correctDot);
    expect(gm.board.getDotById('nonexistent')).toBeFalsy();
  });

  it('should detect a selected dot', function() {
    var dot = gm.board.getDotAt(3, 4);
    expect(gm.board.isDotSelected(dot)).toBe(false);
    expect(gm.board.lastSelectedDot()).toBeFalsy();
    gm.board.selectedDots.push(dot);
    expect(gm.board.isDotSelected(dot)).toBe(true);
    expect(gm.board.lastSelectedDot()).toBe(dot);
  });

  it('should remove a dot', function() {
    var dot = gm.board.getDotAt(2, 5);
    expect(dot).not.toBeFalsy();
    gm.board.removeDot(dot);
    expect(gm.board.getDotById(dot.id)).toBeFalsy();
  });

  it('should remove all selected dots', function() {
    var removeSpy = spyOn(gm.board, 'removeDot');
    var dots = [
      gm.board.getDotAt(0, 3),
      gm.board.getDotAt(1, 1),
      gm.board.getDotAt(5, 2),
    ];
    gm.board.selectedDots = dots;
    gm.board.removeSelectedDots();
    expect(removeSpy).toHaveBeenCalledWith(dots[0], false);
    expect(removeSpy).toHaveBeenCalledWith(dots[1], false);
    expect(removeSpy).toHaveBeenCalledWith(dots[2], false);
  });

  it('should detect adjascent dots', function() {
    var mainDot = gm.board.getDotAt(3, 3);
    expect(Pontos.Board.dotsAreAdjascent(mainDot, gm.board.getDotAt(2, 3))).toBe(true);
    expect(Pontos.Board.dotsAreAdjascent(mainDot, gm.board.getDotAt(3, 2))).toBe(true);
    expect(Pontos.Board.dotsAreAdjascent(mainDot, gm.board.getDotAt(3, 4))).toBe(true);
    expect(Pontos.Board.dotsAreAdjascent(mainDot, gm.board.getDotAt(4, 3))).toBe(true);

    expect(Pontos.Board.dotsAreAdjascent(mainDot, gm.board.getDotAt(2, 2))).toBe(false);
    expect(Pontos.Board.dotsAreAdjascent(mainDot, gm.board.getDotAt(2, 2))).toBe(false);
    expect(Pontos.Board.dotsAreAdjascent(mainDot, gm.board.getDotAt(3, 5))).toBe(false);
    expect(Pontos.Board.dotsAreAdjascent(mainDot, gm.board.getDotAt(3, 1))).toBe(false);
    expect(Pontos.Board.dotsAreAdjascent(mainDot, gm.board.getDotAt(4, 4))).toBe(false);
    expect(Pontos.Board.dotsAreAdjascent(mainDot, gm.board.getDotAt(4, 2))).toBe(false);

    mainDot = gm.board.getDotAt(0, 0);
    expect(Pontos.Board.dotsAreAdjascent(mainDot, gm.board.getDotAt(0, 1))).toBe(true);
    expect(Pontos.Board.dotsAreAdjascent(mainDot, gm.board.getDotAt(1, 0))).toBe(true);
    expect(Pontos.Board.dotsAreAdjascent(mainDot, gm.board.getDotAt(1, 1))).toBe(false);
  });

  it('should select a single dot', function() {
    var selectedDot = gm.board.getDotAt(0, 0);
    gm.board.handleDotSelectionIntention(selectedDot);
    expect(gm.board.isDotSelected(selectedDot)).toBe(true);
    gm.board.getAllDots().forEach(function(dot) {
      if (dot !== selectedDot) {
        expect(gm.board.isDotSelected(dot)).toBe(false);
      }
    });
  });

  it('should select multiple dots', function() {
    var dots = [gm.board.getDotAt(0, 0), gm.board.getDotAt(0, 1)];
    dots[1].color = dots[0].color;
    gm.board.handleDotSelectionIntention(dots[0]);
    gm.board.handleDotSelectionIntention(dots[1]);
    expect(gm.board.isDotSelected(dots[0])).toBe(true);
    expect(gm.board.isDotSelected(dots[1])).toBe(true);
    gm.board.getAllDots().forEach(function(dot) {
      if (dots.indexOf(dot) === -1) {
        expect(gm.board.isDotSelected(dot)).toBe(false);
      }
    });
  });

  it('should select dots by color', function() {
    specHelper.loadBoardFixture6x6(gm.board);
    expect(gm.board.selectDotsByColor('c1').length).toBe(5);
    gm.board.deselectAllDots();
    expect(gm.board.selectDotsByColor('c3').length).toBe(6);
  });

  it('should not select dots that are not adjascent and of the same color', function() {
    // adjascent, but not the same color
    var dots = [gm.board.getDotAt(0, 0), gm.board.getDotAt(0, 1)];
    dots[1].color = 'nonexistent';
    gm.board.handleDotSelectionIntention(dots[0]);
    gm.board.handleDotSelectionIntention(dots[1]);
    expect(gm.board.isDotSelected(dots[0])).toBe(true);
    expect(gm.board.isDotSelected(dots[1])).toBe(false);

    // deselect dots
    gm.board.processPlay();

    // same color, but not adjascent
    dots = [gm.board.getDotAt(3, 4), gm.board.getDotAt(5, 1)];
    dots[1].color = dots[0].color;
    gm.board.handleDotSelectionIntention(dots[0]);
    gm.board.handleDotSelectionIntention(dots[1]);
    expect(gm.board.isDotSelected(dots[0])).toBe(true);
    expect(gm.board.isDotSelected(dots[1])).toBe(false);
  });

  it('should not remove dots if less than 2 dots were selected', function() {
    var removeSpy = spyOn(gm.board, 'removeDot');
    gm.board.processPlay();
    gm.board.selectDot(gm.board.getDotAt(0, 0));
    gm.board.processPlay();
    expect(removeSpy).not.toHaveBeenCalled();
    expect(gm.board.selectedDots.length).toBe(0);
  });

  it('should remove dots if 2 or more are selected', function() {
    var removeSpy = spyOn(gm.board, 'removeDot');
    gm.board.selectDot(gm.board.getDotAt(0, 0));
    gm.board.selectDot(gm.board.getDotAt(0, 1));
    gm.board.processPlay();
    expect(removeSpy.calls.count()).toBe(2);
    expect(gm.board.selectedDots.length).toBe(0);
  });

  it('should detect a closed path selection and set the color for removal', function() {
    expect(gm.board.colorSelectedForRemoval).toBe(null);
    var path = specHelper.makeClosedPathSelection(gm.board);
    expect(gm.board.colorSelectedForRemoval).toBe(path.color);
  });

  it('should remove dots of the selected color', function() {
    var removeSpy = spyOn(gm.board, 'removeDot');
    gm.board.colorSelectedForRemoval = gm.board.getDotAt(3, 4).color;
    var count = gm.board.getDotsByColor(gm.board.colorSelectedForRemoval).length;
    gm.board.processPlay();
    expect(removeSpy.calls.count()).toBe(count);
  });

  it('should execute extra and remove single', function() {
    var removeSpy = spyOn(gm.board, 'removeDot');
    var processSpy = spyOn(gm.board, 'processExecutedExtra');
    var dot = gm.board.getDotAt(2, 3);
    gm.board.executeExtraRemoveSingle(dot);
    expect(removeSpy).toHaveBeenCalledWith(dot, false);
    expect(processSpy).toHaveBeenCalledWith('removeSingle');
  });

  it('should execute extra and remove color', function() {
    var selectSpy = spyOn(gm.board, 'selectDotsByColor');
    var removeSpy = spyOn(gm.board, 'removeSelectedDots');
    var processSpy = spyOn(gm.board, 'processExecutedExtra');
    var dot = gm.board.getDotAt(2, 3);
    gm.board.executeExtraRemoveColor(dot.color);
    expect(selectSpy.calls.count()).toBe(1);
    expect(removeSpy.calls.count()).toBe(1);
    expect(processSpy).toHaveBeenCalledWith('removeColor');
  });

  it('should execute extras', function() {
    var extraSingleSpy = spyOn(gm.board, 'executeExtraRemoveSingle');
    var extraColorSpy = spyOn(gm.board, 'executeExtraRemoveColor');

    var dot = gm.board.getDotAt(0, 0);

    gm.board.handleDotSelectionIntention(dot);

    expect(extraSingleSpy).not.toHaveBeenCalled();
    expect(extraColorSpy).not.toHaveBeenCalled();

    gm.board.extras.removeSingle.active = true;
    gm.board.handleDotSelectionIntention(dot);

    expect(extraSingleSpy).toHaveBeenCalledWith(dot);
    expect(extraColorSpy).not.toHaveBeenCalled();

    gm.board.executeExtraRemoveSingle.calls.reset()
    gm.board.extras.removeSingle.active = false;
    gm.board.extras.removeColor.active = true;
    gm.board.handleDotSelectionIntention(dot);

    expect(extraColorSpy).toHaveBeenCalledWith(dot.color);
    expect(extraSingleSpy).not.toHaveBeenCalled();
  });

  it('should set correct extras statuses', function() {

    gm.board.handleExtraClick('removeSingle');
    expect(gm.board.extras.removeSingle.active).toBe(true);
    expect(gm.board.extras.removeColor.active).toBe(false);

    gm.board.handleExtraClick('removeSingle');
    expect(gm.board.extras.removeSingle.active).toBe(false);
    expect(gm.board.extras.removeColor.active).toBe(false);

    gm.board.handleExtraClick('removeSingle');
    gm.board.handleExtraClick('removeColor');
    expect(gm.board.extras.removeSingle.active).toBe(false);
    expect(gm.board.extras.removeColor.active).toBe(true);

    gm.board.handleExtraClick('removeColor');
    expect(gm.board.extras.removeColor.active).toBe(false);

  });

  it('should process executed extra', function() {

    gm.board.extras.removeSingle.unlimited = false;
    gm.board.extras.removeSingle.remaining = 1;
    gm.board.extras.removeSingle.active = true;
    gm.board.processExecutedExtra('removeSingle');
    expect(gm.board.extras.removeSingle.active).toBe(false);
    expect(gm.board.extras.removeSingle.disabled).toBe(true);
    expect(gm.board.extras.removeSingle.remaining).toBe(0);
    expect(gm.board.extras.removeSingle.unlimited).toBe(false);

    gm.board.extras.removeSingle.disabled = false;
    gm.board.extras.removeSingle.unlimited = false;
    gm.board.extras.removeSingle.remaining = 3;
    gm.board.extras.removeSingle.active = true;
    gm.board.processExecutedExtra('removeSingle');
    expect(gm.board.extras.removeSingle.active).toBe(false);
    expect(gm.board.extras.removeSingle.disabled).toBe(false);
    expect(gm.board.extras.removeSingle.remaining).toBe(2);
    expect(gm.board.extras.removeSingle.unlimited).toBe(false);

    gm.board.extras.removeColor.unlimited = true;
    gm.board.extras.removeColor.remaining = 1;
    gm.board.extras.removeColor.active = true;
    gm.board.processExecutedExtra('removeColor');
    expect(gm.board.extras.removeColor.active).toBe(false);
    expect(gm.board.extras.removeColor.disabled).toBe(false);
    expect(gm.board.extras.removeColor.unlimited).toBe(true);

  });

  it('should notify observers', function() {
    var dots = [gm.board.getDotAt(0, 0), gm.board.getDotAt(0, 1)];
    var spy = spy = spyOn(gm.board.observers, 'notify');

    gm.board.selectDot(dots[0]);
    expect(spy).toHaveBeenCalledWith('dotSelection', [dots[0], true]);

    spy.calls.reset();
    gm.board.deselectAllDots();
    expect(spy).toHaveBeenCalledWith('dotSelection', [[dots[0]], false]);

    // closed path
    spy.calls.reset();
    var path = specHelper.makeClosedPathSelection(gm.board);
    var sameColorDots = gm.board.getDotsByColor(path.color);
    var unselectedSameColorDots = sameColorDots.filter(function(dot) {
      return !gm.board.isDotSelected(dot);
    });
    expect(spy).toHaveBeenCalledWith('dotSelection', [unselectedSameColorDots, true]);

    // deselects the dot that makes the closed path
    spy.calls.reset();
    path.dots.pop();
    gm.board.handleDotSelectionIntention(path.dots[path.dots.length - 1]);
    expect(spy).toHaveBeenCalledWith('dotSelection', [unselectedSameColorDots, false]);

    // deselects the last dot in the path
    spy.calls.reset();
    gm.board.handleDotSelectionIntention(path.dots[path.dots.length - 2]);
    expect(spy).toHaveBeenCalledWith('dotSelection', [path.dots.pop(), false]);

    spy.calls.reset();
    gm.board.removeDot(dots[0], true);
    expect(spy).toHaveBeenCalledWith('dotRemove', dots[0]);

    spy.calls.reset();
    gm.board.selectDotsByColor(gm.board.getDotAt(0, 0).color);
    expect(spy).toHaveBeenCalledWith('performedClosedPath');

    spy.calls.reset();
    gm.board.selectedDots = dots;
    for (var i = 0; i < 6; i++) {
      gm.board.selectedDots.push(gm.board.getDotAt(3, i));
    }
    gm.board.removeSelectedDots();
    expect(spy).toHaveBeenCalledWith('dotRemove', [dots]);
    expect(spy).toHaveBeenCalledWith('specialPlayExecuted');

    spy.calls.reset();
    gm.board.handleExtraClick('removeSingle');
    expect(spy.calls.mostRecent().args[0]).toBe('extraStatusChange');
    expect(spy.calls.mostRecent().args[1]).toBe(gm.board.extras);

    spy.calls.reset();
    gm.board.processExecutedExtra('removeSingle');
    expect(spy.calls.mostRecent().args[0]).toBe('finishedProcessingExtra');
    expect(spy.calls.mostRecent().args[1]).toBe(gm.board.extras);

    spy.calls.reset();
    gm.board.executeExtraRemoveColor(dots[0]);
    expect(spy).toHaveBeenCalledWith('specialPlayExecuted');

  });

});
