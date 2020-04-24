import chalk from 'chalk';
import * as log from '../log';
import {_t} from '../i18n';

import {projectFormatter, SEPARATOR} from '../formatter.js';

module.exports = async (self, config) => {
  const show = (projects) => {
    if (projects.length === 0) {
      log.bold(_t('list.no-projects'));
      log.info(_t('list.no-projects-hint'));
      return;
    }

    let screen = '';
    const countText = projects.length === 1 ? _t('list.count-label-single') : _t('list.count-label', {n: projects.length});
    screen += chalk.inverse.bold(countText) + '\n';

    for (let item of projects) {
      screen += projectFormatter(item) + '\n';
    }

    screen += SEPARATOR;

    console.log(screen);
  };

  const projects = await config.api.getProjects();
  if (projects) {
    show(projects);
  }
};
