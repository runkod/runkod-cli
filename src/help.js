module.exports = function () {

  var help = '\n' +
    '   Usage: runkod [command] [options]' +
    '\n' +
    '\n' +
    '\n' +
    '   Commands:' +
    '\n' +
    '\n' +
    '      login    Logs you in and locally saves your credentials \n\n' +
    '      logout   Removes your stored credentials \n\n' +
    '      whoami   Prints active user information \n\n' +
    '      deploy   Deploys a local folder to a project \n' +
    '               -p, --project (project id | project name | project address | domain name) \n' +
    '               -f, --folder (local path) \n' +
    '               -a, --activate (any) - activates the new deployment if any value given \n\n' +
    '      create   Creates a new project \n\n' +
    '      list     Lists all projects of your account \n\n' +
    '      show     Shows a particular project \n' +
    '               -p, --project (project id | project name | project address | domain name)\n\n' +
    '      status   Updates status of a project  \n' +
    '               -p, --project (project id | project name | project address | domain name)\n\n';

  console.log(help);
};
