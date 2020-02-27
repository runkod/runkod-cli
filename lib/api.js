var axios = require('axios');
var constants = require('./constants');

module.exports = function (ver, baseEndpoint) {
  return {
    token: null,
    setToken: function (token) {
      this.token = token;
    },
    _headers: function () {
      return {Authentication: this.token, 'User-Agent': 'runkod-cli-' + ver};
    },
    _apiGet: function (path) {
      var url = baseEndpoint + path;
      return axios.get(url, {headers: this._headers()}).then(function (resp) {
        return resp.data;
      });
    },
    _apiPost: function (path, data) {
      var url = baseEndpoint + path;
      return axios.post(url, data, {headers: this._headers()}).then(function (resp) {
        return resp.data;
      });
    },
    _apiPut: function (path, data) {
      var url = baseEndpoint + path;
      return axios.put(url, data, {headers: this._headers()}).then(function (resp) {
        return resp.data;
      });
    },
    _apiDelete: function (path) {
      var url = baseEndpoint + path;
      return axios.delete(url, {headers: this._headers()}).then(function (resp) {
        return resp.data;
      });
    },
    me: function () {
      return this._apiGet('/me');
    },
    getProjects: function () {
      return this._apiGet('/projects');
    },
    createProject: function () {
      return this._apiPost('/projects', {});
    },
    deleteProject: function (project_id) {
      return this._apiDelete('/projects/' + project_id);
    },
    stopProject: function (project_id) {
      return this._apiPut('/projects/' + project_id + '/status', {status: constants.PROJECT_STATUS_OFF});
    },
    pauseProject: function (project_id) {
      return this._apiPut('/projects/' + project_id + '/status', {status: constants.PROJECT_STATUS_MAINTENANCE});
    },
    startProject: function (project_id) {
      return this._apiPut('/projects/' + project_id + '/status', {status: constants.PROJECT_STATUS_ON});
    },
    redirectProject: function (project_id, to_id) {
      return this._apiPut('/projects/' + project_id + '/redirect', {to: to_id});
    },
    get_domains: function () {
      return this._apiGet('/domains');
    },
    create_domain: function (name) {
      return this._apiPost('/domains', {name: name});
    },
    delete_domain: function (domain_id) {
      return this._apiDelete('/domains/' + domain_id);
    }
  }
};
