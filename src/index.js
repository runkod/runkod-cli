import 'regenerator-runtime/runtime';

import minimist from 'minimist';
import chalk from 'chalk';

import api from './api';
import commands from './commands';
import help from './help';
import packJs from '../package';

import {readFileArgs} from './helpers';

module.exports = (config) => {
  config = config || {};

  if (!config.endpoint) {
    config.endpoint = 'https://api.runkod.com';
  }

  config.api = api(packJs.version, config.endpoint);

  const argvOptions = {
    alias: {
      p: 'project',
      f: 'folder',
      a: 'activate'
    }
  };

  return (args) => {
    const argv = minimist(args, argvOptions);
    const cmd = argv._[0];

    config.argv = {...argv, ...readFileArgs()};

    const cmdList = [
      'login', 'logout', 'whoami',
      'deploy', 'list', 'show', 'create', 'status'
    ];

    const msg = chalk.inverse.blue.bold('\nRunkod CLI ') + chalk.inverse.blue(`v${packJs.version}\n`);
    console.log(msg);

    if (cmd === 'version') {
      return;
    }

    if (cmdList.indexOf(cmd) !== -1) {
      commands(config).call(cmd)
    } else if (cmd === 'help') {
      help();
    } else {
      commands(config).call('deploy');
    }
  };
};

