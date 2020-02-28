var fs = require('fs');
var path = require('path');

var glob = require('glob');
var JSZip = require('jszip');

var ui = require('../ui');
var utils = require('../utils');
var log = require('../log');
var helpers = require('../helpers');

module.exports = function (self, config) {
  var send = function (project, path, data) {
    log.info('Contents of ' + path + ' deploying to ' + project.name);

    var spin = ui.spinner('Deploying');
    spin.start();
    config.api.deploy(project.id, data).then(function (resp) {
      log.success('\n🎉 Done');
    }).catch(function (err) {
      helpers.handleApiError(err);
    }).finally(function () {
      spin.stop()
    });
  };

  var makeBundle = function (root) {
    var paths = glob.sync(root + '/**/**', {silent: true, absolute: true});

    var files = paths.filter(function (x) {
      return !utils.isDir(x);
    });

    var replace = root + '/';

    var zip = new JSZip();

    files.forEach(function (file) {
      var buff = fs.readFileSync(file);
      var zipPath = file.replace(replace, '');
      zip.file(zipPath, buff);
    });

    return zip.generateAsync({type: 'base64'});
  };

  var folderSelected = function (input, project) {
    var root = path.resolve(input);

    // Must be a valid directory
    if (!utils.isDir(root)) {
      log.error('Please enter a valid path');
      selectFolder(project);
      return;
    }

    makeBundle(root).then(function (buffer) {
      send(project, root, buffer);
    });
  };

  var selectFolder = function (project) {
    var defaultFolder = process.cwd();
    ui.folderInput(defaultFolder).then(function (input) {
      folderSelected(input, project);
    });
  };

  var projectSelected = function (project) {
    if (!project) {
      return;
    }

    selectFolder(project);
  };

  var listProjects = function (resp) {
    ui.select('Select a project to deploy', resp).then(projectSelected);
  };

  config.api.getProjects().then(listProjects);
};
