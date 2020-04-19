var ui = require('../ui');
var log = require('../log');
var helpers = require('../helpers');
var formatter = require('../formatter.js');

module.exports = function (self, config) {
  var projects = null;
  var project = null;

  var show = function () {
    console.log(formatter.project(project));
    console.log(formatter.separator);
  };

  var selectProject = function () {
    // read from argv
    if (config.argv.hasOwnProperty('project')) {
      var r = helpers.resolveProject(projects, config.argv.project);
      if (!r) {
        log.error('No such a project');
        return;
      }

      project = r;

      show();
      return;
    }

    ui.select('Select a project to show', projects).then(function (resp) {
      project = resp;
    }).catch(function () {

    }).finally(function () {
      if (project !== null) {
        show();
      }
    });
  };

  config.api.getProjects().then(function (resp) {
    projects = resp;
  }).catch(function (err) {
    helpers.handleApiError(err);
  }).finally(function () {
    if (projects !== null) {
      selectProject();
    }
  });
};
