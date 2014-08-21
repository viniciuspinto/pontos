describe('Pontos.Renderer', function() {

  'use strict';

  var gameManager, renderer, container;

  beforeEach(function() {
    gameManager = specHelper.createGameManager(true);
    renderer    = gameManager.renderer;
    container   = gameManager.options.container;
  });

  it('should render all the dots', function() {
    var dots = renderer.elements.dots.get(), dotElement;
    expect(dots.length).toBe(36);
    expect(dots).not.toBeHidden();
    expect(dots).toBeVisible();
    expect(parseInt($(dots[0]).css('top'), 10)).toBeGreaterThan(-1);
  });

  it('should render info content when it is present', function() {
    renderer.options.infoContent = null;
    renderer.renderGame(gameManager);
    expect(renderer.elements.statusBar.container.links.infoLink.get()).toBeHidden();

    renderer.options.infoContent = '<p>This is some info!</p>';
    renderer.renderGame(gameManager);
    expect(renderer.elements.statusBar.container.links.infoLink.get()).not.toBeHidden();
    expect(renderer.elements.gameInfo.get()).toContainHtml(renderer.infoContent);
  });

  it('should display score and remaining moves', function() {
    expect($('.score .value', container).text()).toEqual(gameManager.score.totalRemovedDots.toString());
    expect($('.remaining-moves .value', container).text()).toBe(gameManager.score.remainingMoves.toString());
  });

  it('should warn user about screen too small to play', function() {
    renderer.renderWarningScreenTooSmall(true);
    expect(renderer.elements.sizeWarning.get()).not.toBeHidden();
    renderer.renderWarningScreenTooSmall(false);
    expect(renderer.elements.sizeWarning.get()).toBeHidden();
  });

  it('should calculate the correct board dimensions', function() {
    renderer.elements.board.container.get().css('width', 1000);
    renderer.calculateBoardDimensions();
    expect(renderer.dimensions.boardElementWidth).toBe(1000);
    expect(renderer.dimensions.boardLateralMargin).toBe(50);
    expect(renderer.dimensions.dotOuterWidth).toBe(150);
    expect(renderer.dimensions.dotWidth).toBe(90);
    expect(renderer.dimensions.dotBorderWidth).toBe(15);
    expect(renderer.dimensions.dotMargin).toBe(8);
  });

  it('should get dot final rendered top position', function() {
    renderer.dimensions.dotOuterWidth = 150;
    expect(renderer.getDotFinalTopPosition(gameManager.board.getDotAt(3, 0))).toBe(750);
    expect(renderer.getDotFinalTopPosition(gameManager.board.getDotAt(1, 3))).toBe(300);
    expect(renderer.getDotFinalTopPosition(gameManager.board.getDotAt(4, 5))).toBe(0);
  });

  it('should adjust size and position of dot', function() {
    var dot = gameManager.board.getDotAt(0, 0);
    var dotElement = renderer.getDotById(dot.id);
    dot.rendered = false;
    var spy = spyOn(dotElement, 'css');
    var positionSpy = spyOn(renderer, 'getDotFinalTopPosition').and.returnValue(1234);

    renderer.dimensions.dotWidth = 35;
    renderer.dimensions.dotMargin = 7;
    renderer.dimensions.dotBorderWidth = 2;
    renderer.dimensions.dotOuterWidth = 51;
    renderer.dimensions.boardLateralMargin = 15;

    renderer.adjustSizeAndPositionOfDot(dot, dotElement, true);

    expect(spy).toHaveBeenCalledWith('width', 35);
    expect(spy).toHaveBeenCalledWith('height', 35);
    expect(spy).toHaveBeenCalledWith('margin', 7);
    expect(spy).toHaveBeenCalledWith('borderWidth', 2);
    expect(spy).toHaveBeenCalledWith('top', 1234);
    expect(spy).toHaveBeenCalledWith('left', 15);
    expect(positionSpy).toHaveBeenCalledWith(dot);
  });

  it('should not adjust dot that is already rendered', function() {
    var dot = gameManager.board.getDotAt(0, 0);
    dot.rendered = true;
    var spy = spyOn($, 'css');
    renderer.adjustSizeAndPositionOfDot(dot, renderer.getDotById(dot.id));
    expect(spy).not.toHaveBeenCalled();
  });

  it('should animate dot', function() {
    var dot = gameManager.board.getDotAt(2, 4);
    var dotElement = renderer.getDotById(dot.id);
    dot.animated = false;
    var animator = Pontos.Animator.getDefaultDotAnimator();
    var spy = spyOn(animator, 'animate');
    renderer.animateDot(dot, dotElement, animator);
    expect(dotElement).not.toBeHidden();
    expect(dot.animated).toBe(true);
    expect(dot.rendered).toBe(true);
    expect(spy).toHaveBeenCalled();
  });

  it('should only show end screen when game is finished', function() {
    expect(renderer.elements.endScreen.container.get()).toBeHidden();
    expect(renderer.elements.endScreen.container.get()).not.toBeVisible();
    gameManager.finishGame();
    expect(renderer.elements.endScreen.container.get()).not.toBeHidden();
    expect(renderer.elements.endScreen.container.get()).toBeVisible();
  });

  it('should add score to tweet text', function() {
    renderer.options.tweetText = 'I scored <!score> points!';
    expect(renderer.getTweetText(14)).toBe('I scored 14 points!');
  });

  it('when there are high scores, they should be rendered on the end screen', function() {
    renderer.renderEndScreen(gameManager.score);
    expect(renderer.elements.endScreen.container.highScores.get()).toBeHidden();
    expect(renderer.elements.endScreen.container.highScores.get()).not.toBeVisible();
    renderer.renderEndScreen(gameManager.score, [{score:123, date: 123123}]);
    expect(renderer.elements.endScreen.container.highScores.get()).not.toBeHidden();
    expect(renderer.elements.endScreen.container.highScores.get()).toBeVisible();
    expect(renderer.elements.endScreen.container.highScores.get()).toContainHtml('<h3>High Scores</h3>');
  });

  it('should render twitter share link', function() {
    renderer.renderEndScreen(gameManager.score);
    expect(renderer.elements.endScreen.container.share.twitter.link.get()).not.toBeHidden();
    expect(renderer.elements.endScreen.container.share.twitter.link.get()).toBeVisible();
  });

  it('should render facebook share link', function() {
    renderer.options.facebookAppId = 123;
    renderer.options.facebookSharedUrl = 'example.com';
    renderer.renderEndScreen(gameManager.score);
    expect(renderer.elements.endScreen.container.share.facebook.get()).not.toBeHidden();
    expect(renderer.elements.endScreen.container.share.facebook.get()).toBeVisible();
  });

});
