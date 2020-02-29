var helpers = require('../helpers');
var log = require('../log');
var formatter = require('../formatter.js');

module.exports = function (self, config) {
  var project = null;

  config.api.createProject().then(function (resp) {
    project = resp;
  }).catch(function (err) {
    helpers.handleApiError(err);
  }).finally(function () {
    if (project !== null) {
      done();
    }
  });

  var done = function () {
    log.success('✅ New project ' + project.name + ' has been created.');
    console.log(formatter.project(project));
    console.log(formatter.separator);
  }
};
