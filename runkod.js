var api = require('./lib/api');
var commands = require('./lib/commands');
var packJs = require('./package.json');

module.exports = function (config) {
  config = config || {};

  if (!config.hasOwnProperty('endpoint')) {
    config.endpoint = 'https://api.runkod.com';
  }

  config.api = api(packJs.version, config.endpoint);

  return function (args) {
    var cmd = args[0];

    var cmdList = [
      'login', 'logout', 'whoami',
      'deploy',
      'list', 'show', 'create', 'delete', 'redirect', 'stop', 'pause', 'start',
      'domains', 'add_domain', 'delete_domain', 'attach_domain', 'detach_domain'
    ];

    if (cmdList.indexOf(cmd) !== -1) {
      commands(config).call(cmd)
    }
  };
};
