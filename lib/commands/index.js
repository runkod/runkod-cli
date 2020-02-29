var ui = require('../ui');
var localCreds = require('../creds');
var helpers = require('../helpers');
var utils = require('../utils');
var log = require('../log');


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
      require('./logout')(this, config);
    },
    whoami: function () {
      require('./whoami')(this, config);
    },
    deploy: function () {
      require('./deploy')(this, config);
    },
    list: function () {
      require('./list')(this, config);
    },
    show: function(){
      require('./show')(this, config);
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
