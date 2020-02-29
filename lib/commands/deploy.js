var fs = require('fs');
var path = require('path');

var glob = require('glob');
var JSZip = require('jszip');

var ui = require('../ui');
var utils = require('../utils');
var log = require('../log');
var helpers = require('../helpers');
var formatter = require('../formatter.js');

module.exports = function (self, config) {
  var projects = null;
  var project = null;
  var folder = null;
  var buffer = null;
  var respProject = null;

  var done = function () {
    log.success('🎉 Done');
    console.log(formatter.project(respProject));
    console.log(formatter.separator);
  };

  var send = function () {
    var spin = ui.spinner('Deploying');
    spin.start();
    config.api.deploy(project.id, buffer).then(function (resp) {
      respProject = resp;
    }).catch(function (err) {
      helpers.handleApiError(err);
    }).finally(function () {
      spin.stop();
      if (respProject !== null) {
        done();
      }
    });
  };

  var makeBundle = function () {
    var paths = glob.sync(folder + '/**/**', {silent: true, absolute: true});

    var files = paths.filter(function (x) {
      return !utils.isDir(x);
    });

    var replace = folder + '/';

    var zip = new JSZip();

    files.forEach(function (file) {
      var buff = fs.readFileSync(file);
      var zipPath = file.replace(replace, '');
      zip.file(zipPath, buff);
    });

    zip.generateAsync({type: 'base64'}).then(function (resp) {
      buffer = resp;
    }).catch(function () {
      log.error("Couldn't create bundle file");
    }).finally(function () {
      if (buffer !== null) {
        send();
      }
    });
  };

  var validateFolder = function (retry) {
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

  var selectFolder = function () {
    // read from argv
    if (config.argv.hasOwnProperty('folder')) {
      folder = config.argv.folder;
      validateFolder(false);
      return;
    }

    var defaultFolder = process.cwd();
    ui.folderInput(defaultFolder).then(function (input) {
      folder = input;
    }).catch(function () {
    }).finally(function () {
      if (folder !== null) {
        validateFolder(true);
      }
    });
  };

  var selectProject = function () {
    // read from argv
    if (config.argv.hasOwnProperty('project')) {
      var r = helpers.resolveProject(projects, config.argv.project);
      if (!r) {
        log.error('No such a project');
        return;
      }

      project = r;

      log.bold('Project: ' + project.name);
      selectFolder();
      return;
    }

    ui.select('Select a project to deploy', projects).then(function (resp) {
      project = resp;
    }).catch(function () {

    }).finally(function () {
      if (project !== null) {
        selectFolder()
      }
    });
  };

  config.api.getProjects().then(function (resp) {
    projects = resp;
  }).catch(function (err) {
    helpers.handleApiError(err);
  }).finally(function () {
    if (projects !== null) {
      selectProject();
    }
  });
};
