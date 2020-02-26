var prompt = require('prompt');

var loginForm = function (cb) {

  prompt.message = 'Login to Runkod';

  var schema = {
    properties: {
      apiKey: {
        description: 'Enter your api key',
        message: 'Empty key received',
        required: true
      }
    }
  };

  prompt.start();

  prompt.get(schema, function (err, result) {
    if (err) {
      return onErr(err);
    }

    cb(result.apiKey);
  });

  function onErr(err) {
    console.log(err);
    return 1;
  }

};

module.exports = {loginForm: loginForm};
