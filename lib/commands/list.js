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
      done(projects);
    }
  });

  var done = function (list) {

    if(list.length === 0){
      log.bold('You have no projects.');
      log.info('Run `runkod create` to create your first project.');
      return;
    }

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
