var minimist = require('minimist');

var api = require('./lib/api');
var commands = require('./lib/commands');
var packJs = require('./package.json');


module.exports = function (config) {
  config = config || {};

  if (!config.hasOwnProperty('endpoint')) {
    config.endpoint = 'https://api.runkod.com';
  }

  config.api = api(packJs.version, config.endpoint);

  var argvOptions = {
    alias: {
      p: 'project',
      f: 'folder'
    }
  };

  return function (args) {
    var argv = minimist(args, argvOptions);
    var cmd = argv._[0];
    config.argv = argv;

    var cmdList = [
      'login', 'logout', 'whoami',
      'deploy',
      'list', 'create', 'delete', 'status', 'redirect',
      'domains', 'add_domain', 'delete_domain', 'attach_domain', 'detach_domain'
    ];

    if (cmdList.indexOf(cmd) !== -1) {
      commands(config).call(cmd)
    }
  };
};
