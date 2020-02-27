var url = require('url');
var constants = require('./constants');
var chalk = require('chalk');

var hostFromUrl = function (u) {
  return url.parse(u).hostname;
};

var projectStatus = function (code) {
  switch (code) {
    case constants.PROJECT_STATUS_ON:
      return chalk.green('On');
    case constants.PROJECT_STATUS_OFF:
      return chalk.gray('Off');
    case constants.PROJECT_STATUS_MAINTENANCE:
      return chalk.gray('In Maintenance');
  }
};

module.exports = {hostFromUrl: hostFromUrl, projectStatus: projectStatus};
