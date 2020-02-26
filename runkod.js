var api = require('./lib/api');
var commands = require('./lib/commands');

module.exports = function (config) {
  config = config || {};

  if (!config.hasOwnProperty('endpoint')) {
    config.endpoint = 'https://api.runkod.com/api';
  }

  config.api = api(config.endpoint);

  var runkod = function (args) {
    var cmd = args[0];

    var commands = ['login', 'logout', 'deploy', 'whoami', 'list'];

    if (commands.indexOf(cmd) !== -1) {
      // argv.shift();
      runkod[cmd](config)
    }

    /*
    else if(config.default && commands.indexOf(config.default) !== -1 ){
      surge[config.default]({})(argv)
    }*/
  };

  runkod.login = function () {
    return commands.login(config);
  };

  runkod.logout = function () {
    return commands.logout(config);
  };

  runkod.deploy = function () {
    return commands.deploy(config);
  };

  runkod.whoami = function () {
    return commands.whoami(config);
  };

  runkod.list = function () {
    return commands.list(config);
  };

  return runkod;
};
