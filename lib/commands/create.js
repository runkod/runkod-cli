var helpers = require('../helpers');
var log = require('../log');

module.exports = function (self, config) {
  config.api.createProject().then(function (resp) {
    log.success('✅ New project ' + resp.name + ' has been created.');
  }).catch(function (err) {
    helpers.handleApiError(err);
  });
};
