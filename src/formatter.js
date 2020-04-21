import moment from 'moment';
import chalk from 'chalk';
import terminalLink from 'terminal-link';

import * as constants from './constants';

export const SEPARATOR = '-'.repeat(80);

export const projectName = (project) => {
  if (project.domain && project.domain.name) {
    return project.domain.name + '(' + project.name + ')';
  }

  return project.name;
};

export const projectStatus = (project) => {
  switch (project.status) {
    case constants.PROJECT_STATUS_ON:
      return chalk.green('On');
    case constants.PROJECT_STATUS_OFF:
      return chalk.gray('Off');
    case constants.PROJECT_STATUS_MAINTENANCE:
      return chalk.gray('In Maintenance');
  }
};

export const projectFormatter = (project) => {
  let rv = '';

  const name = project.address;
  const link = `https://${project.address}`;
  const id = project.id;
  const status = projectStatus(project);
  const lastDeploy = (project.deployment ? moment(project.deployment.created).fromNow() : '-');

  rv += SEPARATOR + '\n';

  rv += terminalLink(chalk.bold(name), link, {
    fallback: () => {
      return chalk.bold(name);
    }
  });

  if (project.domainRecord) {
    const dLink = `https://${project.domainRecord.name}`;
    rv += ' -> ';
    rv += terminalLink(chalk.bold(project.domainRecord.name), dLink, {
      fallback: () => {
        return chalk.bold(project.domainRecord.name);
      }
    });
  }

  rv += '\n\n';

  rv += 'ID: ' + id + '\t';
  rv += 'Status: ' + status + ' \t';
  rv += 'Last Deploy: ' + lastDeploy + '\t';

  return rv;
};
