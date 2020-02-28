var inquirer = require('inquirer');


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

var pathInput = function (defaultPath) {
  return new Promise(function (resolve) {

    read({
      prompt: chalk.bold('Local path: '),
      default: defaultPath,
      edit: true
    }, function (err, answer) {
      resolve(answer)
    })
  });

};

/*
var pathInput = function (defaultPath) {
  return new Promise(function (resolve) {
    var rl = readline.createInterface(process.stdin, process.stdout);
    rl.question(chalk.bold('Local folder:'), function (answer) {

      console.log(answer);
      resolve(answer);




      rl.close();
    });
    rl.write(defaultPath);
  });
};
*/


/*
var pathInput = function (defaultPath) {


  return inquirer
    .prompt([
      {
        type: 'input',
        name: 'path',
        message: 'Local path: ',
        default: defaultPath,
        validate: function (a) {
          if (a === '') {
            return 'Empty path';
          }

          return true;
        }
      }
    ])
    .then(function (value) {
      return value.path;
    });
};
*/

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

module.exports = {loginForm: loginForm, pathInput: pathInput, select: select, confirm: confirm};

