var axios = require('axios');

module.exports = function (baseEndpoint) {
  return {
    me: function (token) {
      var url = baseEndpoint + '/me';
      var headers = {Authentication: token};
      return axios.get(url, {headers: headers}).then(function (resp) {
        return resp.data
      });
    },
    get_projects: function (token) {
      var url = baseEndpoint + '/projects';
      var headers = {Authentication: token};
      return axios.get(url, {headers: headers}).then(function (resp) {
        return resp.data
      });
    },
    create_project: function (token) {
      var url = baseEndpoint + '/projects';
      var headers = {Authentication: token};
      return axios.post(url, {}, {headers: headers}).then(function (resp) {
        return resp.data
      });
    },
    delete_project: function (token, project_id) {
      var url = baseEndpoint + '/projects/' + project_id;
      var headers = {Authentication: token};
      return axios.delete(url, {headers: headers}).then(function (resp) {
        return resp.data
      });
    }
  }
};



