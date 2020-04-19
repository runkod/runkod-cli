import got from 'got';

import log from './log';

module.exports = function (ver, baseEndpoint) {
  return {
    apiKey: null,
    setApiKey: function (key) {
      this.apiKey = key;
    },
    call: function (endpoint, method, body = null) {
      const init = {
        throwHttpErrors: false,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'runkod-cli-' + ver,
          'X-Runkod-Api-Key': this.apiKey
        },
        method
      };

      if (body) {
        init.body = JSON.stringify(body)
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
    deploy: function (project_id, data) {
      return this.call('/projects/' + project_id + '/deploy', 'POST', {data: data});
    }
  }
};
