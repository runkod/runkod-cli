import * as ui from '../ui';
import * as log from '../log';
import * as constants from '../constants';
import {_t} from "../i18n";
import * as helpers from "../helpers";

module.exports = async (self, config) => {
  const projects = await config.api.getProjects();
  if (!projects) {
    return;
  }

  const project = await ui.selectProject(_t('status.select-project'), projects).catch();
  if (project) {
    // show(project);
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

  /*
  var listProjects = function (resp) {
    ui.select('Select a project to set status', resp).then(onProjectSelect);
  };

  var listOptions = function (project) {
    var options = constants.PROJECT_STATUSES;

    ui.select('Select status', options).then(function (status) {
      onOptionSelect(status, project);
    });
  };

  var onProjectSelect = function (project) {
    if (project) {
      listOptions(project);
    } else {
      log.info('Cancelled');
    }
  };

  var onOptionSelect = function (status, project) {
    if (status) {
      config.api.setProjectStatus(project.id, status.id).then(function () {
        log.success('> Done');
      }).catch(function (err) {

      });

    } else {
      log.info('Cancelled');
    }
  };

  config.api.getProjects().then(listProjects);

   */
};
