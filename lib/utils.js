var url = require('url');
var fs = require('fs');
var chalk = require('chalk');

var hostFromUrl = function (u) {
  return url.parse(u).hostname;
};

var isDir = function (path) {
  try {
    return fs.lstatSync(path).isDirectory();
  } catch (e) {
    return false;
  }
};


module.exports = {hostFromUrl: hostFromUrl, isDir: isDir};
