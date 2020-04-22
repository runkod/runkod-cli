import * as ui from '../ui';
import * as log from '../log';
import * as constants from '../constants';
import {_t} from '../i18n';
import * as helpers from '../helpers';
import * as formatter from '../formatter';
import chalk from "chalk";

module.exports = async (self, config) => {
  const projectID = config.argv.hasOwnProperty('project') ? config.argv.project : null;

  let project = null;
  let status = null;

  const send = async () => {
    project = await config.api.setProjectStatus(project.id, status);
    log.success(_t('status.success'));
    console.log(formatter.projectFormatter(project));
    console.log(formatter.SEPARATOR);
  };

  const selectStatus = async () => {
    if (projectID) {
      console.log(`${chalk.bold(_t('status.selected-project'))} ${formatter.projectName(project)}`);
    }

    const options = constants.PROJECT_STATUSES;

    const answer = await ui.select(_t('status.select-status'), options);
    if (answer && answer.value) {
      status = answer.value;
      send().then();
    }
  };

  const projects = await config.api.getProjects();
  if (!projects) {
    return;
  }

  if (projectID) {
    project = helpers.resolveProject(projects, projectID);
    if (project) {
      selectStatus().then();
    } else {
      log.error(_t('status.no-project', {i: projectID}));
    }
    return;
  }

  if (projects.length === 0) {
    log.bold(_t('status.no-projects'));
    log.info(_t('status.no-projects-hint'));
    return;
  }

  project = await ui.selectProject(_t('status.select-project'), projects).catch();
  if (project) {
    selectStatus().then();
  }
};
