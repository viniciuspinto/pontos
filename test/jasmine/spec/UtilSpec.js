describe('Pontos.Util', function() {

  'use strict';

  var Util = Pontos.Util;

  it('should sort in ascendent order', function() {
    var a = [3, 1 , 2, 2, 5, 9, 8, 7, 6];
    expect(Util.ascSort(a)).toEqual([1, 2, 2, 3, 5, 6, 7, 8, 9]);
  });

  it('should get correct ordinal suffix', function() {
    expect(Util.getOrdinalSuffix(1)).toEqual('st');
    expect(Util.getOrdinalSuffix(2)).toEqual('nd');
    expect(Util.getOrdinalSuffix(3)).toEqual('rd');
    expect(Util.getOrdinalSuffix(4)).toEqual('th');
    expect(Util.getOrdinalSuffix(5)).toEqual('th');

    expect(Util.getOrdinalSuffix(10)).toEqual('th');
    expect(Util.getOrdinalSuffix(11)).toEqual('th');
    expect(Util.getOrdinalSuffix(12)).toEqual('th');

    expect(Util.getOrdinalSuffix(20)).toEqual('th');
    expect(Util.getOrdinalSuffix(21)).toEqual('st');
    expect(Util.getOrdinalSuffix(22)).toEqual('nd');
    expect(Util.getOrdinalSuffix(23)).toEqual('rd');
    expect(Util.getOrdinalSuffix(24)).toEqual('th');
  });

  it('should get month name', function() {
    // 0-based
    expect(Util.getMonthName(0)).toEqual('January');
    expect(Util.getMonthName(11)).toEqual('December');
  });

  it('should get weekday name', function() {
    expect(Util.getWeekdayName(0)).toEqual('Sunday');
    expect(Util.getWeekdayName(6)).toEqual('Saturday');
  });

  it('should convert string to camel case', function() {
    expect(Util.toCamelCase('the')).toEqual('the');
    expect(Util.toCamelCase('the quick')).toEqual('theQuick');
    expect(Util.toCamelCase('the-quick')).toEqual('theQuick');
    expect(Util.toCamelCase('the quick brown-fox')).toEqual('theQuickBrownFox');
  });

});
