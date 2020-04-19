import ui from '../ui';
import localCreds from '../creds';
import utils from '../utils';
import log from '../log';

export default (config) => {
  return {
    call: function (cmd) {
      if (['login'].indexOf(cmd) === -1) {
        const cred = this._getCredential();

        if (!cred) {
          console.log('');
          log.warning("You haven't logged in yet!");
          console.log('');

          this.login(() => {
            // Don't call callback for logout and whoami
            if (['logout', 'whoami'].indexOf(cmd) === -1) {
              this.call(cmd);
            }
          });
          return;
        }

        config.api.setApiKey(cred);
      }

      this[cmd]();
    },
    _getCredential: function () {
      const host = utils.hostFromUrl(config.endpoint);
      return localCreds(host).get();
    },
    _setCredential: function (val) {
      const host = utils.hostFromUrl(config.endpoint);
      localCreds(host).set(val);
    },
    login: function (cb) {
      const self = this;

      const keyReceived = async (key) => {
        config.api.setApiKey(key);

        const me = await config.api.me();

        if (!me) {
          config.api.setApiKey(null);
          this.login(cb);
          return;
        }

        done(key, me);
      };

      const done = (key, me) => {
        self._setCredential(key);
        console.log('');
        log.success('👍 Logged in as ' + me.name + '<' + me.email + '>');
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
    show: function () {
      require('./show')(this, config);
    },
    create: function () {
      require('./create')(this, config);
    },
    status: function () {
      require('./status')(this, config);
    }
  };
};
