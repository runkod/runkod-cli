var ui = require('../ui');
var helpers = require('../helpers');
var log = require('../log');

module.exports = function (self, config) {
  var onLoad = function (resp) {
    ui.select('Select a project to delete', resp).then(onSelect);
  };

  var onSelect = function (project) {
    if (project) {
      ui.confirm('Are you absolutely sure?').then(function (resp) {
        if (resp) {
          onConfirm(project);
        } else {
          log.info('Cancelled');
        }
      })
    } else {
      log.info('Cancelled');
    }
  };

  var onConfirm = function (project) {
    config.api.deleteProject(project.id).then(function (resp) {
      log.success('> Done');
    }).catch(function (err) {
      helpers.handleApiError(err);
    });
  };

  config.api.getProjects().then(onLoad);
};
