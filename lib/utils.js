var url = require('url');

var hostFromUrl = function (u) {
  return url.parse(u).hostname;
};

module.exports = {hostFromUrl: hostFromUrl};
