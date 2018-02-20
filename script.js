/**
 * Some helper methods
 */

function genRandomData(numValues, maxValue) {
  var randomData = [];
  for (var i = 0; i < numValues; i++) {
    var newNumber = Math.floor((Math.random() * maxValue) + 1);
    randomData.push(newNumber);
  }

  return randomData;
}

function genRandomKeyMappedData(numValues, maxValue) {
  var randomKeyMappedData = [];
  for (var i = 0; i < numValues; i++) {
    var newNumber = Math.floor((Math.random() * maxValue) + 1);
    randomKeyMappedData.push({ 'key': i, 'value': newNumber});
  }

  return randomKeyMappedData;
}