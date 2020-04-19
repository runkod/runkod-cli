import moment from 'moment';
import chalk from 'chalk';

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

  const name = project.name;
  const id = project.id;
  const status = projectStatus(project);
  const lastDeploy = (project.deployment ? moment(project.deployment.created).fromNow() : '-');

  rv += SEPARATOR + '\n';

  rv += chalk.inverse(name);

  if (project.domainRecord) {
    rv += ' -> ';
    rv += chalk.inverse(project.domainRecord.name);
  }

  rv += '\n\n';

  rv += 'ID: ' + id + '\t';
  rv += 'Status: ' + status + ' \t';
  rv += 'Last Deploy: ' + lastDeploy + '\t';

  return rv;
};
