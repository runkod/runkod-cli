var inquirer = require('inquirer');
var ora = require('ora');
var chalk = require('chalk');
var read = require('read');

var loginForm = function () {
  return inquirer
    .prompt([
      {
        type: 'password',
        name: 'input',
        message: 'Enter your api key: ',
        validate: function (a) {
          if (a === '') {
            return 'Empty key received';
          }

          return true;
        }
      }
    ])
    .then(function (value) {
      return value.input;
    });
};

var folderInput = function (defaultPath) {
  return new Promise(function (resolve) {
    read({
      prompt: chalk.bold('Local folder: '),
      default: defaultPath,
      edit: true
    }, function (err, answer) {
      resolve(answer.trim())
    })
  });
};

var select = function (title, options) {
  var cancel = '---Cancel---';

  options.unshift({name: cancel});

  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'name',
        message: title,
        choices: options,
        pageSize: 20
      }
    ])
    .then(function (value) {
      if (value.name === cancel) {
        return null;
      }

      return options.find(function (x) {
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

var spinner = function (title) {
  return ora(title);
};

module.exports = {loginForm: loginForm, folderInput: folderInput, select: select, confirm: confirm, spinner: spinner};

