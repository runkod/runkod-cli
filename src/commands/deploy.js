import fs from 'fs'
import path from 'path';

import glob from 'glob';
import tmp from 'tmp';
import JSZip from 'jszip';
import FormData from 'form-data';
import chalk from 'chalk';

import *  as ui from '../ui';
import * as utils from '../utils';
import * as log from '../log';
import * as helpers from '../helpers';
import * as formatter from '../formatter.js';
import {_t} from '../i18n';

module.exports = async (self, config) => {
  let projects = null;
  let project = null;
  let folder = null;
  let deployment = null;
  let filePath = null;

  const done = () => {
    log.success('🎉 Done');
    console.log(formatter.projectFormatter(respProject));
    console.log(formatter.SEPARATOR);
  };

  const send = async () => {
    const spin = ui.spinner('Uploading');
    spin.start();

    const {size: fileSize} = fs.statSync(filePath);
    let uploaded = 0;

    const form = new FormData();
    const file = fs.createReadStream(filePath).on('data', (chunk) => {
      uploaded += chunk.length;
      const percent = Math.ceil((uploaded / fileSize) * 100);
      spin.text = `Uploading ${percent}%`;
    });

    form.append('file', file);

    try {
      deployment = await config.api.deploy(project.id, form);
    } catch (e) {

    } finally {
      spin.stop();
      fs.unlinkSync(filePath);
    }

    log.success('\n🎉 Deploy completed \n');


    if (deployment.isActive === false) {
      const msg = "Do you want to activate it now?";
      const r = await ui.confirm(msg);
      if (r) {
        await config.api.activateDeployment(project.id, deployment.id);
      }
    }

    console.log();
  };

  const inspectFiles = async (files) => {
    // html files
    if (files.filter(x => x.endsWith('.html')).length === 0) {
      // return _t('project.deploy.warning-no-html');
      const msg = "The deployment you are uploading doesn't contain any html files. Usually web applications contain at least one html file. Continue?";
      const r = await ui.confirm(msg);
      if (!r) {
        return false;
      }
    }

    // server side files
    if (files.filter(x => x.endsWith('.php')).length > 0) {
      const msg = "Server side code detected. Note that Runkod doesn't provide server side code support. Continue?";
      const r = await ui.confirm(msg);
      if (!r) {
        return false;
      }
    }

    // check node_modules
    if (files.filter(x => x.indexOf('node_modules/') > -1).length > 0) {
      const msg = "You are about to deploy a folder that contains 'node_modules'. You might want to choose a build folder instead. Continue?";
      const r = await ui.confirm(msg);
      if (!r) {
        return false;
      }
    }

    return true;
  };

  const makeBundle = async () => {
    const paths = glob.sync(folder + '/**/**', {silent: true, absolute: true});
    const files = paths.filter((x) => !utils.isDir(x));

    if (!await inspectFiles(files)) {
      return false;
    }

    const replace = folder + '/';

    const zip = new JSZip();

    files.forEach(function (file) {
      const buff = fs.readFileSync(file);
      const zipPath = file.replace(replace, '');
      zip.file(zipPath, buff);
    });

    const file = tmp.fileSync();
    filePath = file.name;

    zip.generateNodeStream({type: 'nodebuffer', compression: 'DEFLATE', streamFiles: true})
      .pipe(fs.createWriteStream(filePath))
      .on('finish', function () {
        send();
      });
  };

  const validateFolder = function (retry) {
    if (folder === '') {
      log.error('Enter a valid path!');
      if (retry) {
        selectFolder();
      }
      return;
    }

    folder = path.resolve(folder);

    // Must be a valid directory
    if (!utils.isDir(folder)) {
      log.error('Please enter a valid path');
      if (retry) {
        selectFolder();
      }
      return;
    }

    makeBundle();
  };

  const selectFolder = async () => {
    console.log(`${chalk.bold('Project:')} ${project.address}`);

    // read from argv
    if (config.argv.hasOwnProperty('folder')) {
      folder = config.argv.folder;
      validateFolder(false);
      return;
    }

    const defaultFolder = process.cwd();
    ui.folderInput(defaultFolder).then(function (input) {
      folder = input;
    }).catch(function () {
    }).finally(function () {
      if (folder !== null) {
        validateFolder(true);
      }
    });
  };

  const selectProject = async () => {
    // read from argv
    if (config.argv.hasOwnProperty('project')) {
      const identifier = config.argv.project;
      project = helpers.resolveProject(projects, identifier);
      if (project) {
        selectFolder().then();
        return;
      }
      log.error(_t('no-project', {i: identifier}));
      return;
    }

    // no project. create a new one.
    if (projects.length === 0) {
      project = await config.api.createProject();
      selectFolder().then();
      return
    }

    // there is only 1 project. select it.
    if (projects.length === 1) {
      project = projects[0];
      selectFolder().then();
      return;
    }

    // select a project from list
    project = await ui.select('Select a project to deploy', projects);
    if (project) {
      selectFolder().then();
      return;
    }

    log.info('Cancelled');
  };

  projects = await config.api.getProjects();
  if (projects) {
    selectProject().then()
  }
};
