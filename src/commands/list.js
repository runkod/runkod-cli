var chalk = require('chalk');

var log = require('../log');
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
      done();
    }
  });

  var done = function () {

    if (projects.length === 0) {
      log.bold('You have no projects.');
      log.info('Run `runkod create` to create your first project.');
      return;
    }

    var screen = chalk.bold(projects.length + ' project(s)') + '\n';

    for (var a = 0; a < projects.length; a++) {
      var item = projects[a];
      screen += formatter.project(item) + '\n';
    }

    screen += formatter.separator;
    console.log(screen);
  };
};
