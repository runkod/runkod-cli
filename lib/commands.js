var ui = require('./ui');
var localCreds = require('./creds');
var helpers = require('./helpers');
var utils = require('./utils');
var log = require('./log');
var chalk = require('chalk');
var constants = require('./constants');
var fs = require('fs');
var path = require('path');
var glob = require('glob');
var JSZip = require('jszip');

module.exports = function (config) {
  return {
    call: function (cmd) {
      if (['login'].indexOf(cmd) === -1) {
        var cred = this._getCredential();
        if (!cred) {
          console.log('');
          log.warning("You haven't logged in yet!");
          console.log('');

          var self = this;
          this.login(function () {
            // Don't callback for logout and whoami
            if (['logout', 'whoami'].indexOf(cmd) === -1) {
              self.call(cmd);
            }
          });
          return;
        }

        config.api.setToken(cred);
      }

      this[cmd]();
    },
    _getCredential: function () {
      var host = utils.hostFromUrl(config.endpoint);
      return localCreds(host).get();
    },
    _setCredential: function (val) {
      var host = utils.hostFromUrl(config.endpoint);
      localCreds(host).set(val);
    },
    login: function (cb) {
      var self = this;

      var keyReceived = function (key) {
        config.api.setToken(key);
        config.api.me().then(function (resp) {
          done(key, resp);
        }).catch(function (err) {
          helpers.handleApiError(err);
          config.api.setToken(null);
          self.login(cb);
        });
      };

      var done = function (key, resp) {
        self._setCredential(key);
        console.log('');
        log.success('👍 Logged in as ' + resp.name + '<' + resp.email + '>');
        console.log('');
        if (cb) {
          cb();
        }
      };

      ui.loginForm().then(keyReceived);
    },
    logout: function () {
      this._setCredential(null);
      console.log('');
      log.success('👋 Bye');
      console.log('');
    },
    whoami: function () {
      config.api.me().then(function (resp) {
        log.info(resp.name + '<' + resp.email + '>');
      }).catch(function (err) {
        helpers.handleApiError(err);
      });
    },
    deploy: function () {
      // Select project
      // Select folder

      var defaultPath = process.cwd();
      var pathSelected = function (res) {
        // Must be an absolute path
        if (res.indexOf('/') !== 0) {
          log.error('Please enter an absolute path');
          selectPath();
          return;
        }

        var root = path.resolve(res);

        // Must be a valid directory
        if (!utils.isDir(root)) {
          log.error('Please enter a valid path');
          selectPath();
          return;
        }

        var allFiles = glob.sync(root + '/**/**', {});

        var files = allFiles.filter(function (x) {
          return !utils.isDir(x);
        });

        var zip = new JSZip();

        for (var f = 0; f < files.length; f++) {
          var file = files[f];

          var buff = fs.readFileSync(file);

          var zipPath = file.replace(root + '/', '');

          zip.file(zipPath, buff);
        }

        zip.generateAsync({type: 'nodebuffer'})
          .then(function (buff) {
            console.log(buff.length)
          });
      };

      var projectSelected = function (project, path) {

      };

      var selectPath = function () {
        ui.pathInput(defaultPath).then(pathSelected)
      };

      selectPath();
    },
    list: function () {
      config.api.getProjects().then(function (resp) {
        done(resp)
      });

      var done = function (list) {
        var separator = '-'.repeat(80);

        var screen = '\n';
        screen += chalk.bold(list.length + ' project(s)') + '\n';

        for (var a = 0; a < list.length; a++) {
          var item = list[a];

          var name = item.name;
          var id = item.id;
          var status = utils.projectStatus(item.status);
          var lastDeploy = (item.deployment ? item.deployment.created : '-');

          screen += separator + '\n';

          if (item.domain) {
            var domainName = item.domain.name;
            screen += chalk.inverse(domainName) + '(' + name + ')' + '\n\n';
          } else {
            screen += chalk.inverse(name) + '\n\n';
          }

          screen += 'ID: ' + id + '\t';
          screen += 'Status: ' + status + ' \t';
          screen += 'Last Deployment: ' + lastDeploy + '\t';

          if (item.redirect_to) {
            screen += chalk.italic('Redirects to: ' + item.redirect_to);
          }

          screen += '\n';
        }

        screen += separator + '\n';

        console.log(screen);
      };
    },
    create: function () {
      config.api.createProject().then(function (resp) {
        log.success('✅ New project ' + resp.name + ' has been created.');
      }).catch(function (err) {
        helpers.handleApiError(err);
      });
    },
    delete: function () {
      var onLoad = function (resp) {
        ui.select('Select a project to delete', resp).then(onSelect);
      };

      var onSelect = function (project) {
        if (project) {
          ui.confirm('Are you absolutely sure?').then(function (resp) {
            if (resp) {
              onConfirm(project);
            } else {
              log.info('Cancelled');
            }
          })
        } else {
          log.info('Cancelled');
        }
      };

      var onConfirm = function (project) {
        config.api.deleteProject(project.id).then(function (resp) {
          log.success('> Done');
        }).catch(function (err) {
          helpers.handleApiError(err);
        });
      };

      config.api.getProjects().then(onLoad);
    },
    status: function () {
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
            helpers.handleApiError(err);
          });

        } else {
          log.info('Cancelled');
        }
      };

      config.api.getProjects().then(listProjects);
    }
  };
};
