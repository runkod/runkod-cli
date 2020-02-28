var log = require('../log');

module.exports = function (self) {
  self._setCredential(null);
  log.success('👋 Bye');
};
