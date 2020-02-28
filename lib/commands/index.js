var ui = require('../ui');
var localCreds = require('../creds');
var helpers = require('../helpers');
var utils = require('../utils');
var log = require('../log');
var constants = require('../constants');
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
      require('./whoami')(this, config);
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
      require('./list')(this, config);
    },
    create: function () {
      require('./create')(this, config);
    },
    delete: function () {
      require('./delete')(this, config);
    },
    status: function () {
      require('./status')(this, config);
    }
  };
};
