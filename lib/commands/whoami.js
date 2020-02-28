var helpers = require('../helpers');
var log = require('../log');

module.exports = function (self, config) {
  config.api.me().then(function (resp) {
    log.info(resp.name + '<' + resp.email + '>');
  }).catch(function (err) {
    helpers.handleApiError(err);
  });
};
