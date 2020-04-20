import got from 'got';
import log from './log';

module.exports = function (ver, baseEndpoint) {
  return {
    apiKey: null,
    setApiKey: function (key) {
      this.apiKey = key;
    },
    call: function (endpoint, method, jsonBody = null, formBody = null) {

      let init = {
        throwHttpErrors: false,
        headers: {
          'User-Agent': 'runkod-cli-' + ver,
          'X-Runkod-Api-Key': this.apiKey
        },
        method
      };

      if (jsonBody) {
        init = Object.assign({}, init, {
          'Content-Type': 'application/json',
          'body': JSON.stringify(jsonBody)
        });
      } else if (formBody) {
        init.body = formBody
      }

      const url = `${baseEndpoint}${endpoint}`;

      return got(url, init).then((r) => {
        if ([400, 405].includes(r.statusCode)) {
          log.error(`${r.statusCode} - ${r.statusMessage}`);
          return null;
        }

        const body = JSON.parse(r.body);

        if (body.code) {
          log.error(body.message);
          return null;
        }

        return body;
      })
    },
    me: function () {
      return this.call('/me', 'GET');
    },
    getProjects: function () {
      return this.call('/projects', 'GET');
    },
    createProject: function (name) {
      return this.call('/projects', 'POST', {name});
    },
    setProjectStatus: function (project_id, statusCode) {
      return this.call('/projects/' + project_id + '/status', 'PUT', {status: statusCode});
    },
    deploy: function (project_id, form) {
      return this.call('/projects/' + project_id + '/deployments', 'POST', null, form);
    }
  }
};
