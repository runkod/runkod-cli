import os from 'os';
import path from 'path';
import fs from 'fs';
import netrc from 'netrc';

module.exports = (host) => {
  const getFile = function () {
    const home = process.env[(/^win/.test(process.platform)) ? 'USERPROFILE' : 'HOME'];
    return path.join(home, '.netrc');
  };

  const get = () => {
    let obj = {};

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

  const set = (token) => {
    let file = getFile();

    let obj = {};
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
