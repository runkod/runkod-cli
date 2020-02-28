var log = require('./log');
var constants = require('./constants');

var handleApiError = function (err) {
  if (err.response && err.response.data && err.response.data.code) {
    log.error('! ' + err.response.data.code + ' - ' + err.response.data.message);
  } else {
    console.error('Server Error');
  }
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


module.exports = {handleApiError: handleApiError, projectStatus:projectStatus};
