var chalk = require('chalk');

var info = function (msg) {
  console.log(chalk.gray(msg));
};

var warning = function (msg) {
  console.log(chalk.yellow(msg));
};

var success = function (msg) {
  console.log(chalk.green(msg));
};

var error = function (msg) {
  console.log(chalk.red(msg));
};

var bold = function(msg){
  console.log(chalk.bold(msg));
};

module.exports = {info: info, warning: warning, success: success, error: error, bold:bold};
