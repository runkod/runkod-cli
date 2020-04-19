import ui from '../ui';
import log from '../log';
import * as helpers from '../helpers';
import * as formatter from '../formatter.js';

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
    const project = helpers.resolveProject(projects, config.argv.project);
    if (project) {
      show(project);
    } else {
      log.error('No such a project');
    }
    return;
  }

  const project = await ui.select('Select a project to show', projects);
  if (project) {
    show(project);
  }
};
