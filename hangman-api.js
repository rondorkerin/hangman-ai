var Promise = require('bluebird');
var request = require('request-promise');

var BASE_URL = 'http://hangman-api.herokuapp.com';

var MAX_FAILURES = 10;

var THROTTLE_DELAY = 2500;

exports.newGame = function() {
  var options = {
    uri: BASE_URL + '/hangman',
    json: true,
    method: 'POST'
  }
  return request(options)
  .then(function(result) {
    return Promise.delay(THROTTLE_DELAY)
    .then(function() {
      if (result) {
        return result;
      }
    })
  })
}

exports.guessLetter = function(token, letter) {
  var options = {
    uri: BASE_URL + '/hangman',
    json: true,
    method: 'PUT',
    form: {
      token: token,
      letter: letter
    }
  }

  return request(options)
  .then(function(result) {
    return Promise.delay(THROTTLE_DELAY)
    .then(function() {
      if (result) {
        return result;
      }
    })
  })

}

