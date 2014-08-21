Pontos.Animator = function(fxFunction, callback, initialPosition, positionOffset, duration) {
  this.fxFunction = fxFunction;
  this.callback = callback;
  this.initialPosition = initialPosition;
  this.positionOffset = positionOffset;
  this.duration = duration;
  this.startTime = new Date();
};

Pontos.Animator.skipAnimation = false;

Pontos.Animator.getDefaultDotAnimator = function() {
  var animator = new Pontos.Animator(Pontos.Animator.deltaForBounce);
  animator.duration = 800;
  return animator;
};

Pontos.Animator.prototype.animate = function() {
  var self = this;
  if (Pontos.Animator.skipAnimation) {
    self.callback.call(this, self.initialPosition + self.positionOffset);
  } else {
    window.requestAnimationFrame(function() {
      self.step(self);
    });
  }
};

Pontos.Animator.prototype.step = function(self) {
  var elapsedTime = new Date() - self.startTime;
  var timeProgress = elapsedTime / self.duration;
  var animationProgress = self.fxFunction.call(self, timeProgress);

  if (animationProgress === false) {
    self.callback.call(this, self.initialPosition + self.positionOffset);
    return true;
  } else {
    self.callback.call(this, self.initialPosition + Math.ceil(animationProgress * self.positionOffset));
  }

  window.requestAnimationFrame(function() {
    self.step(self);
  });
};

Pontos.Animator.deltaForBounce = function(timeProgress) {
  // This is adapted from examples found online,
  // not sure about the original source
  var progress = 1 - timeProgress;
  if (progress < 0) {
    return false;
  } else {
    var a = 0, b = 1;
    while (true) {
      if (progress >= (7 - 4 * a) / 11) {
        return 1 - (Math.pow(b, 2) - Math.pow((11 - 6 * a - 11 * progress) / 4, 2));
      }
      a += b;
      b /= 2;
    }
  }
};
