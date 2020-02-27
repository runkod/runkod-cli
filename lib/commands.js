var ui = require('./ui');
var localCreds = require('./creds');
var helpers = require('./helpers');
var utils = require('./utils');
var log = require('./log');


module.exports = function (config) {
  return {
    call: function (cmd) {
      if (['login'].indexOf(cmd) === -1) {
        var token = this._getToken();
        if (!token) {
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

        config.token = token;
      }

      this[cmd]();
    },
    _getToken: function () {
      var host = utils.hostFromUrl(config.endpoint);
      return localCreds(host).get();
    },
    _setToken: function (token) {
      var host = utils.hostFromUrl(config.endpoint);
      localCreds(host).set(token);
    },
    login: function (cb) {
      ui.loginForm(function (key) {
        keyReceived(key);
      });

      var self = this;

      var keyReceived = function (key) {
        config.api.me(key).then(function (resp) {
          done(key, resp);
        }).catch(function (err) {
          helpers.handleApiError(err);
          self.login(cb);
        });
      };

      var done = function (key, resp) {
        self._setToken(key);
        console.log('');
        log.success('👍 Logged in as ' + resp.name + '<' + resp.email + '>');
        console.log('');
        if (cb) {
          cb();
        }
      };
    },
    logout: function () {
      this._setToken(null);
      console.log('');
      log.success('👋 Bye');
      console.log('');
    },
    whoami: function () {
      config.api.me(config.token).then(function (resp) {
        console.log('');
        log.success(resp.name + '<' + resp.email + '>');
        console.log('');
      }).catch(function (err) {
        helpers.handleApiError(err);
      });
    },
    deploy: function () {

    },
    list: function () {
      config.api.get_projects(config.token).then(function (resp) {
        done(resp)
      });

      var done = function (resp) {
        console.log(resp);
      }
    },
    create: function () {
      config.api.create_project(config.token).then(function (resp) {
        console.log('');
        log.success('✅ New project ' + resp.name + ' has been created.');
        console.log('');
      }).catch(function (err) {
        helpers.handleApiError(err);
      });
    },
    delete: function () {
      var onLoad = function (resp) {
        ui.projectList('Select a project to delete', resp).then(onSelect);
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
        config.api.delete_project(config.token, project.id).then(function (resp) {
          console.log('');
          log.info(project.name + ' has been deleted.');
          console.log('');
        }).catch(function (err) {
          helpers.handleApiError(err);
        });
      };

      config.api.get_projects(config.token).then(onLoad);
    }
  };
};
