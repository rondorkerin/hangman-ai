var Promise = require('bluebird');
var _ = require('underscore');

// todo: trim a single dict continuously rather than re-trimming the same dict
exports.trimDict = function(dict, hangman) {
  if (hangman.length) {
    dict = _.reject(dict, function(word) {
      return hangman.length != word.length
    })
  }

  for (var i = 0; i < hangman.length; i++) {
    // dont trim underscore
    if (hangman[i] != '_') {
      dict = _.reject(dict, function(word) {
        return word[i] != hangman[i];
      })
    }
  }

  return dict;
}

exports.removeIncorrectGuess = function(guess, dict) {
  return _.reject(dict, function(word) {
    return word.indexOf(guess) !== -1;
  })
}

exports.findBestNgram = function(frequencies, hangman) {

}

exports.getNgramFrequencies = function(dict, order) {
  var frequencies = {};
  _.each(dict, function(word) {
    for (var i = 0; i < word.length - order + 1; i++) {
      var ngram = word.substring(i, i + order)
      if (frequencies[ngram]) {
        frequencies[ngram]++;
      } else {
        frequencies[ngram] = 1;
      }
    }
  });

  var sortedFrequencies = _.sortBy(_.pairs(frequencies), function(frequencyPair) {
    return frequencyPair[1];
  }).reverse();

  return sortedFrequencies;
}

exports.getLetterFrequencies = function(dict, guesses) {
  var frequencies = {};
  _.each(dict, function(word) {
    word = word.toLowerCase();
    _.each(word, function(letter) {
      if (/[a-z]/.test(letter) && guesses.indexOf(letter) === -1) {
        if (frequencies[letter]) {
          frequencies[letter]++
        } else {
          frequencies[letter] = 1;
        }
      }
    })
  });

  var sortedFrequencies = _.sortBy(_.pairs(frequencies), function(frequencyPair) {
    return frequencyPair[1];
  }).reverse();

  return sortedFrequencies;
}

exports.findNextMove = Promise.method(function(hangman, numFailures, guesses, dict) {
  hangman = hangman.toLowerCase();
  var sortedFrequencies = exports.getLetterFrequencies(dict, guesses);
  for (var i = 0; i < sortedFrequencies.length; i++) {
    var frequencyPair = sortedFrequencies[i];
    var letter = frequencyPair[0];
    // if the letter hasnt been guessed before, pick it.
    if (guesses.indexOf(letter) === -1) {
      debugger;
      return letter;
    }
  }

  throw 'insufficient dictionary';
})
