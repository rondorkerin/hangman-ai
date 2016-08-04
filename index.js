var HangmanAPI = require('./hangman-api');
var Promise = require('bluebird');
var MAX_FAILURES = 10;

var AI = require('./ai/dictionary');
var fs = require('fs');
var masterDictionary = fs.readFileSync('dictionary.txt', 'utf8').split('\n');

exports.play = function(token, hangman, numFailures, guesses, dict) {
  var currentGuess = '';
  dict = AI.trimDict(dict, hangman, guesses);
  return AI.findNextMove(hangman, numFailures, guesses, dict)
  .then(function(nextGuess) {
    currentGuess = nextGuess;
    guesses.push(currentGuess);
    console.log('guessing letter', nextGuess, 'failures:', numFailures, 'hangman:', hangman);
    return HangmanAPI.guessLetter(token, nextGuess)
  })
  .then(function(guessResult) {
    console.log('Guess was', guessResult['correct'] ? 'correct' : 'incorrect', guessResult['hangman']);
    if (!guessResult['correct']) {
      numFailures++;
      dict = AI.removeIncorrectGuess(currentGuess, dict);
    }
    token = guessResult['token'];
    hangman = guessResult['hangman'];
    return Promise.delay(1000)
  })
  .then(function() {
    if (numFailures > MAX_FAILURES) {
      console.log('We lost!', hangman);
    } else if (hangman.indexOf('_') === -1) {
      console.log('We won!', hangman);
    } else {
      return exports.play(token, hangman, numFailures, guesses, dict);
    }
  })
};

// initialize the game
exports.init = function() {
  debugger;
  return HangmanAPI.newGame()
  .then(function(token) {
    return exports.play(token, '', 0, [], masterDictionary);
  })
}

exports.init();
