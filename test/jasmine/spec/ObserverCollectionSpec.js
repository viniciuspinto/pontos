describe('Pontos.ObserverCollection', function() {

  var collection, self = this;

  this.sampleCallback = function() {
    return true;
  }

  beforeEach(function() {
    collection = new Pontos.ObserverCollection(['aaa', 'bbb', 'ccc']);
  });

  it('should add observer to a single subject', function() {
    collection.add('aaa', self, self.sampleCallback);
    expect(collection.observers.aaa[0]).toEqual([self, self.sampleCallback]);
  });

  it('should add observer to multiple subjects', function() {
    collection.add(['aaa', 'ccc'], self, self.sampleCallback);
    expect(collection.observers.aaa[0]).toEqual([self, self.sampleCallback]);
    expect(collection.observers.ccc[0]).toEqual([self, self.sampleCallback]);
    expect(collection.observers.bbb.length).toBe(0);
  });

  it('should add multiple observers to a subject', function() {
    collection.add('bbb', self, self.sampleCallback);
    collection.add('bbb', window, alert);
    expect(collection.observers.bbb[0]).toEqual([self, self.sampleCallback]);
    expect(collection.observers.bbb[1]).toEqual([window, alert]);
    expect(collection.observers.aaa.length).toBe(0);
    expect(collection.observers.ccc.length).toBe(0);
  });

  it('should notify observers', function() {
    var spy = spyOn(self, 'sampleCallback');

    collection.add('aaa', self, self.sampleCallback);
    collection.add('bbb', self, self.sampleCallback);

    expect(spy).not.toHaveBeenCalled();

    collection.notify('aaa', 'some arg');
    expect(spy).toHaveBeenCalledWith('some arg');
    expect(spy.calls.count()).toBe(1);

    collection.notify('bbb', [4, 8, 15]);
    expect(spy).toHaveBeenCalledWith(4, 8, 15);

    collection.notify(['aaa', 'bbb'], 'multiple');
    expect(spy.calls.count()).toBe(4);
    expect(spy).toHaveBeenCalledWith('multiple');
  });

});
