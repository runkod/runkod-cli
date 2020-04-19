import log from '../log';
import * as ui from '../ui';
import * as formatter from '../formatter.js';

module.exports = async (self, config) => {

  const name = await ui.input('Enter a project name or leave it empty for a random name: ');
  const project = await config.api.createProject(name);
  if (!project) {
    return;
  }

  log.success('✅ New project has been created.');
  console.log(formatter.projectFormatter(project));
  console.log(formatter.SEPARATOR);
};
