import moment from 'moment';
import chalk from 'chalk';
import terminalLink from 'terminal-link';

import * as constants from './constants';

import {_t} from './i18n';

export const SEPARATOR = '-'.repeat(80);

export const projectName = (project) => {
  const name = project.address;
  const link = `https://${project.address}`;

  let rv = terminalLink(chalk.bold(name), link, {
    fallback: () => {
      return chalk.bold(name);
    }
  });

  if (project.domainRecord) {
    const rLink = `https://${project.domainRecord.name}`;
    const recordName = project.domainRecord.name;
    rv += ' -> ';
    rv += terminalLink(chalk.bold(recordName), rLink, {
      fallback: () => {
        return chalk.bold(recordName);
      }
    });
  }

  return rv;
};

export const projectStatus = (project) => {
  switch (project.status) {
    case constants.PROJECT_STATUS_ON:
      return chalk.green(_t('project-status.on'));
    case constants.PROJECT_STATUS_MAINTENANCE:
      return chalk.gray(_t('project-status.maintenance'));
    case constants.PROJECT_STATUS_OFF:
      return chalk.gray(_t('project-status.off'));
  }
};

export const projectFormatter = (project) => {
  let rv = '';

  const id = project.id;
  const status = projectStatus(project);
  const activeDeploy = (project.deployment ? moment(project.deployment.created).fromNow() : '-');

  rv += SEPARATOR + '\n';

  rv += projectName(project);

  rv += '\n\n';

  rv += 'ID: ' + id + '\t';
  rv += 'Status: ' + status + ' \t';
  rv += 'Active Deployment: ' + activeDeploy + '\t';

  return rv;
};
