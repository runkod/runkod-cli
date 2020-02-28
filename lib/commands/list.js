var helpers = require('../helpers');
var chalk = require('chalk');

module.exports = function (self, config) {
  config.api.getProjects().then(function (resp) {
    done(resp)
  });

  var done = function (list) {
    var separator = '-'.repeat(80);

    var screen = '\n';
    screen += chalk.bold(list.length + ' project(s)') + '\n';

    for (var a = 0; a < list.length; a++) {
      var item = list[a];

      var name = item.name;
      var id = item.id;
      var status = helpers.projectStatus(item.status);
      var lastDeploy = (item.deployment ? item.deployment.created : '-');

      screen += separator + '\n';

      if (item.domain) {
        var domainName = item.domain.name;
        screen += chalk.inverse(domainName) + '(' + name + ')' + '\n\n';
      } else {
        screen += chalk.inverse(name) + '\n\n';
      }

      screen += 'ID: ' + id + '\t';
      screen += 'Status: ' + status + ' \t';
      screen += 'Last Deployment: ' + lastDeploy + '\t';

      if (item.redirect_to) {
        screen += chalk.italic('Redirects to: ' + item.redirect_to);
      }

      screen += '\n';
    }

    screen += separator + '\n';

    console.log(screen);
  };
};
