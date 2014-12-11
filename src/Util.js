Pontos.Util = function() {
};

Pontos.Util.getRandomInteger = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Pontos.Util.ascSort = function(arr) {
  return arr.sort(function(a, b) {
    return a - b;
  });
};

Pontos.Util.getOrdinalSuffix = function(i) {
  // source: http://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
  var j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
      return "st";
  }
  if (j == 2 && k != 12) {
      return "nd";
  }
  if (j == 3 && k != 13) {
      return "rd";
  }
  return "th";
};

Pontos.Util.getMonthName = function(n) {
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return monthNames[n];
};

Pontos.Util.getWeekdayName = function(n) {
  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[n];
};

Pontos.Util.toCamelCase = function(input) { 
  return input.toLowerCase().replace(/[ -](.)/g, function(match, group1) {
    return group1.toUpperCase();
  });
};
