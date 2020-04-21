import * as ui from '../ui';
import * as log from '../log';
import * as helpers from '../helpers';
import * as formatter from '../formatter.js';
import {_t} from '../i18n';

module.exports = async (self, config) => {
  const show = function (project) {
    console.log(formatter.projectFormatter(project));
    console.log(formatter.SEPARATOR);
  };

  const projects = await config.api.getProjects();
  if (!projects) {
    return;
  }

  if (config.argv.hasOwnProperty('project')) {
    const identifier = config.argv.project;
    const project = helpers.resolveProject(projects, identifier);
    if (project) {
      show(project);
      return;
    } else {
      log.error(_t('no-project', {i: identifier}));
    }
  }

  if (projects.length === 0) {
    log.bold('You have no projects.');
    log.info('Run `runkod create` to create your first project.');
    return;
  }

  const project = await ui.selectProject('Select a project to show', projects).catch();
  if (project) {
    show(project);
  }
};
