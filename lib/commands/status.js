var ui = require('../ui');
var helpers = require('../helpers');
var log = require('../log');
var constants = require('../constants');

module.exports = function (self, config) {
  var listProjects = function (resp) {
    ui.select('Select a project to set status', resp).then(onProjectSelect);
  };

  var listOptions = function (project) {
    var options = constants.PROJECT_STATUSES;

    ui.select('Select status', options).then(function (status) {
      onOptionSelect(status, project);
    });
  };

  var onProjectSelect = function (project) {
    if (project) {
      listOptions(project);
    } else {
      log.info('Cancelled');
    }
  };

  var onOptionSelect = function (status, project) {
    if (status) {
      config.api.setProjectStatus(project.id, status.id).then(function () {
        log.success('> Done');
      }).catch(function (err) {
        helpers.handleApiError(err);
      });

    } else {
      log.info('Cancelled');
    }
  };

  config.api.getProjects().then(listProjects);
};
