Pontos.ObserverCollection = function(actions) {

  this.actions = $.isArray(actions) ? actions : [actions];
  this.observers = {};

  for (var i = 0; i < actions.length; i++) {
    this.observers[actions[i]] = [];
  }

};

Pontos.ObserverCollection.prototype.add = function(actions, context, callback) {
  if (!$.isArray(actions)) {
    actions = [actions];
  }
  for (var i = 0; i < actions.length; i++) {
    if (actions[i] in this.observers) {
      this.observers[actions[i]].push([context, callback]);
    } else {
      console.log('Unknown action: ' + actions[i]);
    }
  }
};

Pontos.ObserverCollection.prototype.notify = function(actions, args) {
  var m;
  if (!$.isArray(args)) {
    args = [args];
  }
  if (!$.isArray(actions)) {
    actions = [actions];
  }
  for (var i = 0; i < actions.length; i++) {
    for (var k = 0; k < this.observers[actions[i]].length; k++) {
      m = this.observers[actions[i]][k];
      m[1].apply(m[0], args);
    }
  }
};
