var forms = require('./forms');
var localCreds = require('./creds');
var helpers = require('./helpers');
var utils = require('./utils');

var getToken = function (config) {
  var host = utils.hostFromUrl(config.endpoint);
  return localCreds(host).get();
};

var setToken = function (config, token) {
  var host = utils.hostFromUrl(config.endpoint);
  localCreds(host).set(token);
};

var login = function (config, cb) {
  forms.loginForm(function (key) {
    keyReceived(key);
  });

  var keyReceived = function (key) {
    config.api.me(key).then(function () {
      done(key);
    }).catch(function (err) {
      helpers.handleApiError(err);
      login(config, cb);
    });
  };

  var done = function (key) {
    setToken(config, key);
    if (cb) {
      cb();
    }
  };
};

var logout = function (config) {
  var token = getToken(config);
  if (!token) {
    console.log("You haven't logged in yet!");
    login(config);
    return;
  }

  setToken(config, null);
  console.log('Logged out');
};

var deploy = function (config) {

};

var whoami = function (config) {
  var token = getToken(config);
  if (!token) {
    console.log('Needs login!');
    login(config, function () {
      whoami(config);
    });
    return;
  }

  config.api.me(token).then(function (resp) {
    console.log("");
    console.log(resp.name + '<' + resp.email + '>');
    console.log("");
  }).catch(function (err) {
    helpers.handleApiError(err);
  });
};

var list = function (config) {

};

module.exports = {login: login, logout: logout, deploy: deploy, whoami: whoami, list: list};
