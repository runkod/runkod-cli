import fs from 'fs'
import path from 'path';

import glob from 'glob';
import tmp from 'tmp';
import JSZip from 'jszip';
import FormData from 'form-data';

import *  as ui from '../ui';
import * as utils from '../utils';
import * as log from '../log';
import * as helpers from '../helpers';
import * as formatter from '../formatter.js';

module.exports = async (self, config) => {
  let projects = null;
  let project = null;
  let folder = null;
  let respProject = null;
  let filePath = null;

  const done = () => {
    log.success('🎉 Done');
    console.log(formatter.projectFormatter(respProject));
    console.log(formatter.SEPARATOR);
  };

  const send = async () => {
    const spin = ui.spinner('Uploading');
    spin.start();

    const {size: fileSize} = fs.statSync('file.zip');
    let uploaded = 0;

    const form = new FormData();
    const file = fs.createReadStream(filePath).on('data', (chunk) => {
      uploaded += chunk.length;
      const percent = Math.ceil((uploaded / fileSize) * 100);
      spin.text = `Uploading ${percent}%`;
    });

    form.append('file', file);

    try {
      respProject = await config.api.deploy(project.id, form);
    } catch (e) {

    } finally {
      spin.stop();
      fs.unlinkSync(filePath);
    }
  };

  const makeBundle = async () => {
    const paths = glob.sync(folder + '/**/**', {silent: true, absolute: true});

    const files = paths.filter((x) => !utils.isDir(x));

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
    // log.bold(`Project: ${formatter.projectName(project)}`);

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
        selectFolder();
        return;
      }

      log.error(`No such a project: ${identifier}`);
      return;
    }

    project = await ui.select('Select a project to deploy', projects);
    if (project) {
      selectFolder();
      return;
    }
    log.info('Cancelled');
  };

  projects = await config.api.getProjects();
  if (projects) {
    selectFolder().then()
  }
};
