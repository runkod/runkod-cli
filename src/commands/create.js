import * as log from '../log';
import * as ui from '../ui';
import * as formatter from '../formatter.js';
import {_t} from '../i18n';

module.exports = async (self, config) => {
  const form = async () => {
    const name = await ui.input(_t('create.input-label'));
    submit(name).then();
  };

  const submit = async (name) => {
    const project = await config.api.createProject(name);
    if (!project) {
      form().then();
      return;
    }

    log.success(_t('create.success'));
    console.log(formatter.projectFormatter(project));
    console.log(formatter.SEPARATOR);
  };

  form().then();
};
