import chalk from 'chalk';
import log from '../log';

import {projectFormatter, SEPARATOR} from '../formatter.js';

module.exports = async (self, config) => {
  const resp = await config.api.getProjects();

  if (resp.code) {
    log.error(resp.message);
    return;
  }

  if (resp.length === 0) {
    log.bold('You have no projects.');
    log.info('Run `runkod create` to create your first project.');
    return;
  }

  let screen = chalk.bold(resp.length + ' project(s)') + '\n';

  for (let item of resp) {
    screen += projectFormatter(item) + '\n';
  }

  screen += SEPARATOR;

  console.log(screen);
};
