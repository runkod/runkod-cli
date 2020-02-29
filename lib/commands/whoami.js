var helpers = require('../helpers');
var log = require('../log');

module.exports = function (self, config) {
  var me = null;

  config.api.me().then(function (resp) {
    me = resp;
  }).catch(function (err) {
    helpers.handleApiError(err);
  }).finally(function () {
    if (me !== null) {
      done();
    }
  });

  var done = function () {
    log.bold(me.name + ' <' + me.email + '>');
  }
};
