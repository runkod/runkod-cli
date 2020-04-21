import * as ui from '../ui';
import localCreds from '../creds';
import * as utils from '../utils';
import log from '../log';
import {_t} from '../i18n';

export default (config) => {
  return {
    call: function (cmd) {
      if (['login'].indexOf(cmd) === -1) {
        const cred = this._getCredential();

        if (!cred) {
          console.log('');
          log.warning(_t('login-required'));
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
        this._setCredential(key);
        log.success(_t('login.success', {name: me.name, email: me.email}));
        if (cb) {
          cb();
        }
      };

      ui.passwordInput(_t('login.input-label'), _t('login.input-error')).then(keyReceived);
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
