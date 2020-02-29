var chalk = require('chalk');

var helpers = require('../helpers');
var formatter = require('../formatter.js');

module.exports = function (self, config) {
  var projects = null;

  config.api.getProjects().then(function (resp) {
    projects = resp;
  }).catch(function (err) {
    helpers.handleApiError(err);
  }).finally(function () {
    if (projects !== null) {
      done(projects);
    }
  });

  var done = function (list) {
    var screen = '\n';
    screen += chalk.bold(list.length + ' project(s)') + '\n';

    for (var a = 0; a < list.length; a++) {
      var item = list[a];
      screen += formatter.project(item) + '\n';
    }

    screen += formatter.separator + '\n';
    console.log(screen);
  };
};
