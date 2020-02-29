var log = require('./log');
var constants = require('./constants');
var chalk = require('chalk');

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

var resolveProject = function (projects, val) {
  // id search
  if (!isNaN(val)) {
    return projects.find(function (x) {
      return x.id === val
    })
  }

  var byName = projects.find(function (x) {
    return x.name === val
  });

  if (byName) {
    return byName;
  }

  var byDomainName = projects.find(function (x) {
    return x.hasOwnProperty('domain') && x.domain.name === val
  });

  if (byDomainName) {
    return byDomainName;
  }

  return null;
};


module.exports = {handleApiError: handleApiError, projectStatus: projectStatus, resolveProject: resolveProject};
