var api = require('./lib/api');
var commands = require('./lib/commands');

module.exports = function (config) {
  config = config || {};

  if (!config.hasOwnProperty('endpoint')) {
    config.endpoint = 'https://api.runkod.com/api';
  }

  config.api = api(config.endpoint);

  return function (args) {
    var cmd = args[0];

    var cmdList = ['login', 'logout', 'whoami', 'deploy', 'list', 'create', 'stop', 'pause', 'delete', 'custom_domain'];

    if (cmdList.indexOf(cmd) !== -1) {
      commands(config).call(cmd)
    }
  };
};
