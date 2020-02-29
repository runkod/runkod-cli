var helpers = require('./helpers');
var moment = require('moment');
var chalk = require('chalk');

var separator = '-'.repeat(80);

var project = function (project) {
  var rv = '';

  var name = project.name;
  var id = project.id;
  var status = helpers.projectStatus(project.status);
  var lastDeploy = (project.deployment ? moment(project.deployment.created).fromNow() : '-');

  rv += separator + '\n';

  if (project.domain) {
    var domainName = project.domain.name;
    rv += chalk.inverse(domainName) + '(' + name + ')' + '\n\n';
  } else {
    rv += chalk.inverse(name) + '\n\n';
  }

  rv += 'ID: ' + id + '\t';
  rv += 'Status: ' + status + ' \t';
  rv += 'Last Deploy: ' + lastDeploy + '\t';

  if (project.redirect_to) {
    rv += chalk.italic('Redirects to: ' + project.redirect_to);
  }

  return rv;
};

module.exports = {separator: separator, project: project}
