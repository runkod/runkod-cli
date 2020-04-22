import request from 'request';
import * as log from './log';

module.exports = function (ver, baseEndpoint) {
  return {
    apiKey: null,
    setApiKey: function (key) {
      this.apiKey = key;
    },
    call: function (endpoint, method, jsonBody = null, formBody = null) {

      const url = `${baseEndpoint}${endpoint}`;

      let init = {
        url,
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'runkod-cli-' + ver,
          'X-Runkod-Api-Key': this.apiKey
        },
      };

      if (jsonBody) {
        init.body = JSON.stringify(jsonBody);
      } else if (formBody) {
        init.formData = formBody;
      }

      return new Promise((resolve, reject) => {
        request(init, (err, httpResp, resp) => {

          if ([400, 405].includes(httpResp.statusCode)) {
            log.error(`${httpResp.statusCode} - ${httpResp.statusMessage}`);
            resolve(null);
            return;
          }

          if (err) {
            throw 'Connection error!';
          }

          const body = JSON.parse(resp);
          if (body.code) {
            log.error(body.message);
            resolve(null);
            return;
          }

          resolve(body);
        });
      });
    },
    me: function () {
      return this.call('/me', 'GET');
    },
    getProjects: function () {
      return this.call('/projects', 'GET');
    },
    getProject: function (project) {
      return this.call(`/projects/${project}`, 'GET');
    },
    createProject: function (name) {
      return this.call('/projects', 'POST', {name});
    },
    setProjectStatus: function (project, statusCode) {
      return this.call('/projects/' + project + '/status', 'PUT', {status: statusCode});
    },
    deploy: function (project, form) {
      return this.call('/projects/' + project + '/deployments', 'POST', null, form)
    },
    activateDeployment: function (project, deployment) {
      return this.call(`/projects/${project}/deployments/${deployment}`, 'PUT')
    }
  }
};
