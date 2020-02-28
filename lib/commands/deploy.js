var fs = require('fs');
var path = require('path');

var glob = require('glob');
var JSZip = require('jszip');
var fileSize = require('filesize');

var ui = require('../ui');
var utils = require('../utils');
var log = require('../log');

module.exports = function (self, config) {
  var send = function (project, path, buffer) {
    log.info('Contents of ' + path + ' deploying to ' + project.name);
    log.info(fileSize(buffer.length) + ' data size');
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

    return zip.generateAsync({type: 'nodebuffer'});
  };

  var folderSelected = function (input, project) {
    var root = path.resolve(input);

    // Must be a valid directory
    if (!utils.isDir(root)) {
      log.error('Please enter a valid path');
      selectFolder();
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
