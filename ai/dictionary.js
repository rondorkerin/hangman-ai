var Promise = require('bluebird');
var _ = require('underscore');

// todo: trim a single dict continuously rather than re-trimming the same dict
exports.trimDict = function(dict, hangman) {
  debugger;
  dict = _.reject(dict, function(word) {
    return hangman.length != word.length
  })
  debugger;

  for (var i = 0; i < hangman.length; i++) {
    // dont trim underscore
    if (hangman[i] != '_') {
      dict = _.reject(dict, function(word) {
        return word[i] != hangman[i];
      })
    }
  }

  debugger;
  /*
  dict = _.reject(dict, function(word) {
    return !(/^[a-z]+/.test(word));
  })
  */

  return dict;
}

exports.removeIncorrectGuess = function(guess, dict) {
  return _.reject(dict, function(word) {
    return word.indexOf(guess) !== -1;
  })
}

exports.getLetterFrequencies = function(dict) {
  var frequencies = {};
  _.each(dict, function(word) {
    _.each(word, function(letter) {
      if (/[a-z]/.test(letter)) {
        if (frequencies[letter]) {
          frequencies[letter]++
        } else {
          frequencies[letter] = 1;
        }
      }
    })
  });

  debugger;
  var sortedFrequencies = _.sortBy(_.pairs(frequencies), function(frequencyPair) {
    return frequencyPair[1];
  }).reverse();

  return sortedFrequencies;
}

exports.findNextMove = Promise.method(function(hangman, numFailures, guesses, dict) {
  debugger;
  var trimmedDict = exports.trimDict(dict, hangman, guesses);
  var sortedFrequencies = exports.getLetterFrequencies(dict);
  for (var i = 0; i < sortedFrequencies.length; i++) {
    var frequencyPair = sortedFrequencies[i];
    var letter = frequencyPair[0];
    // if the letter hasnt been guessed before, pick it.
    if (guesses.indexOf(letter) === -1) {
      return letter;
    }
  }

  throw 'insufficient dictionary';
})
