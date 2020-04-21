import chalk from 'chalk';
import * as log from '../log';
import {_t} from '../i18n';

import {projectFormatter, SEPARATOR} from '../formatter.js';

module.exports = async (self, config) => {
  const resp = await config.api.getProjects();

  if (resp.code) {
    log.error(resp.message);
    return;
  }

  if (resp.length === 0) {
    log.bold(_t('list.no-projects'));
    log.info(_t('list.no-projects-hint'));
    return;
  }

  let screen = '';
  const countText = resp.length === 1 ? _t('list.count-label-single') : _t('list.count-label', {n: resp.length});
  screen += chalk.inverse.bold(countText) + '\n';

  for (let item of resp) {
    screen += projectFormatter(item) + '\n';
  }

  screen += SEPARATOR;

  console.log(screen);
};
