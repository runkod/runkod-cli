var minimist = require('minimist');

var api = require('./lib/api');
var commands = require('./lib/commands');
var packJs = require('./package.json');


module.exports = function (config) {
  config = config || {};

  if (!config.endpoint) {
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
      'list', 'show', 'create', 'delete', 'status'
    ];

    if (cmdList.indexOf(cmd) !== -1) {
      commands(config).call(cmd)
    }
  };
};
