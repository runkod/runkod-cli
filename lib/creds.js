var os = require('os');
var path = require('path');
var fs = require('fs');
var netrc = require('netrc');

module.exports = function (host) {
  var getFile = function () {
    var home = process.env[(/^win/.test(process.platform)) ? 'USERPROFILE' : 'HOME'];
    return path.join(home, '.netrc');
  };

  var get = function () {
    var obj = {};

    try {
      obj = netrc(getFile())
    } catch (e) {
    }

    if (obj.hasOwnProperty(host)) {
      return obj[host]['token'];
    } else {
      return null;
    }
  };

  var set = function (token) {
    var file = getFile();

    var obj = {};
    try {
      obj = netrc(file);
    } catch (e) {
    }

    if (token === null) {
      delete obj[host];
      fs.writeFileSync(file, netrc.format(obj) + os.EOL);
      return null;
    } else {
      obj[host] = {
        'token': token
      };
      fs.writeFileSync(file, netrc.format(obj) + os.EOL);
      return get();
    }
  };

  return {
    set: set,
    get: get
  }
};
