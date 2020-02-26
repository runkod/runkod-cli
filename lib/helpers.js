var handleApiError = function (err) {
  if (err.response && err.response.data) {
    var msg = '';

    switch (err.response.data.code) {
      case 16:
        msg = 'Invalid api key';
        break;
    }

    console.log(msg);
  } else {
    console.error('Server Error');
  }
};

module.exports = {handleApiError: handleApiError};
