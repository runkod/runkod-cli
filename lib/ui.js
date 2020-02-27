var prompt = require('prompt');
var inquirer = require('inquirer');

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


var projectList = function (title, list) {
  list.unshift({name: 'Cancel'});

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'name',
        message: title,
        choices: list,
        pageSize: 20
      }
    ])
    .then(function (value) {
      if (value.name === 'Cancel') {
        return null;
      }

      return list.find(function (x) {
        return x.name === value.name;
      });
    });
};

var confirm = function (title) {
  return inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: title,
        default: false
      }
    ]).then(function (value) {
      return value.confirm;
    })
};


module.exports = {loginForm: loginForm, projectList: projectList, confirm: confirm};

