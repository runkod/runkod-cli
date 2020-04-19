var axios = require('axios');

import got from 'got';

module.exports = function (ver, baseEndpoint) {
  return {
    apiKey: null,
    setApiKey: function (key) {
      this.apiKey = key;
    },
    _headers: function () {
      return {'X-Runkod-Api-Key': this.apiKey, 'Content-Type': 'application/json', 'User-Agent': 'runkod-cli-' + ver};
    },
    _apiGet: function (path) {
      const url = baseEndpoint + path;
      return got.get(url, {headers: this._headers(), throwHttpErrors: false}).json();
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
    setProjectStatus: function (project_id, statusCode) {
      return this._apiPut('/projects/' + project_id + '/status', {status: statusCode});
    },
    deploy: function (project_id, data) {
      return this._apiPost('/projects/' + project_id + '/deploy', {data: data});
    }
  }
};
