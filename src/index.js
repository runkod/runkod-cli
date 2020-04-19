import 'regenerator-runtime/runtime';

import minimist from 'minimist';

import api from './api';
import commands from './commands';
import help from './help';
import packJs from '../package';

module.exports = (config) => {
  config = config || {};

  if (!config.endpoint) {
    config.endpoint = 'https://api1.runkod.com';
  }

  config.api = api(packJs.version, config.endpoint);

  const argvOptions = {
    alias: {
      p: 'project',
      f: 'folder'
    }
  };

  return (args) => {
    const argv = minimist(args, argvOptions);
    const cmd = argv._[0];

    config.argv = argv;

    const cmdList = [
      'login', 'logout', 'whoami',
      'deploy', 'list', 'show', 'create', 'status'
    ];

    if (cmdList.indexOf(cmd) !== -1) {
      commands(config).call(cmd)
    } else if (cmd === 'help') {
      help();
    } else if (cmd === 'version') {
      console.log('Runkod ' + packJs.version);
    } else {
      commands(config).call('deploy');
    }
  };
};

