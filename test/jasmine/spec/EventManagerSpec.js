describe('Pontos.EventManager', function() {

  'use strict';

  var gameManager = null;
  var eventManager = null;

  beforeEach(function() {
    gameManager = specHelper.createGameManager(true);
    eventManager = gameManager.renderer.eventManager;
  });

  it('should resize game when window is resized', function() {
    var spy = spyOn(gameManager.renderer, 'setDimensionsAndPositioning');
    $(window).trigger('resize');
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should handle click on dot', function() {
    var clickSpy = spyOn(gameManager.board, 'handleDotSelectionIntention');
    var dot = gameManager.board.getDotAt(0, 0);
    var dotElement = gameManager.renderer.getDotById(dot.id);
    dotElement.trigger({ type: 'mousedown', which: 1 });
    expect(clickSpy).toHaveBeenCalledWith(dot);
  });

  it('should handle dot selection on mouse over', function() {
    var spy = spyOn(gameManager.board, 'handleDotSelectionIntention');
    var dot = gameManager.board.getDotAt(0, 0);
    gameManager.renderer.getDotById(dot.id).trigger({ type: 'mousedown', which: 1 });
    expect(spy).toHaveBeenCalledWith(dot);
    var dot2 = gameManager.board.getDotAt(0, 1);
    dot2.color = dot.color;
    gameManager.renderer.getDotById(dot2.id).trigger('mouseover');
    expect(spy).toHaveBeenCalledWith(dot2);
  });

  it('should process play on click is released', function() {
    var spy = spyOn(gameManager.board, 'processPlay');
    var dot = gameManager.board.getDotAt(0, 0);
    var dotElement = gameManager.renderer.getDotById(dot.id);
    $(document).trigger('mouseup');
    $(document).trigger('touchend');
    dotElement.trigger('mouseup');
    dotElement.trigger('touchend');
    expect(spy.calls.count()).toBe(4);
  });

  it('should restart game when clicking on new', function() {
    var spy = spyOn(gameManager, 'restart');
    gameManager.renderer.elements.statusBar.container.links.newGame.get().trigger('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should restart game when clicking on play again at the end screen', function() {
    gameManager.renderer.renderEndScreen(gameManager.score, []);
    var spy = spyOn(gameManager, 'restart');
    gameManager.renderer.elements.endScreen.container.playAgain.get().trigger('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should open info when clicking on info link', function() {
    var spy = spyOn(gameManager.renderer, 'showInfo');
    gameManager.renderer.elements.statusBar.container.links.infoLink.get().trigger('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should close info when clicking on close info link', function() {
    var spy = spyOn(gameManager.renderer, 'hideInfo');
    gameManager.renderer.elements.gameInfo.container.content.menu.close.get().trigger('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should handle click on extra', function() {
    var extraSpy = spyOn(gameManager.board, 'handleExtraClick');
    gameManager.renderer.elements.extras.container.removeSingle.get().trigger('click');
    gameManager.renderer.elements.extras.container.removeColor.get().trigger('click');
    expect(extraSpy.calls.count()).toBe(2);
  });

  it('should track mouse state', function() {
    eventManager.setMouseDown(true);
    eventManager.setMouseDown(false);
    expect(eventManager.mouseDownCounter).toBe(0);
    eventManager.setMouseDown(true);
    expect(eventManager.mouseDownCounter).toBe(1);
    eventManager.setMouseDown(true);
    eventManager.setMouseDown(false);
    eventManager.setMouseDown(false);
    eventManager.setMouseDown(false);
    expect(eventManager.mouseDownCounter).toBe(0);
  });

});
