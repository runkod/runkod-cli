var axios = require('axios');

module.exports = function (baseEndpoint) {
  return {
    me: function (token) {
      var url = baseEndpoint + '/me';
      var headers = {Authentication: token};
      return axios.get(url, {headers: headers}).then(function (resp) {
        return resp.data
      });
    }
  }
};



