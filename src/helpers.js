var log = require('./log');


var handleApiError = function (err) {
  if (err.response && err.response.data && err.response.data.code) {
    log.error('! ' + err.response.data.code + ' - ' + err.response.data.message);
  } else {
    console.error('Server Error');
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
    return x.domain && x.domain.name === val
  });

  if (byDomainName) {
    return byDomainName;
  }

  return null;
};


module.exports = {
  handleApiError: handleApiError,
  resolveProject: resolveProject
};
