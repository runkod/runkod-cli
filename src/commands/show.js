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
    } else {
      log.error(_t('show.no-project', {i: identifier}));
    }
    return;
  }

  if (projects.length === 0) {
    log.bold(_t('show.no-projects'));
    log.info(_t('show.no-projects-hint'));
    return;
  }

  const project = await ui.selectProject(_t('show.select-project'), projects).catch();
  if (project) {
    show(project);
  }
};
