var log = require('./log');

var handleApiError = function (err) {
  if (err.response && err.response.data && err.response.data.code) {
    log.error('! ' + err.response.data.code + ' - ' + err.response.data.message);
  } else {
    console.error('Server Error');
  }
};

module.exports = {handleApiError: handleApiError};
