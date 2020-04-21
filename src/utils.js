import url from 'url';
import fs from 'fs';

export const hostFromUrl = (u) => {
  return url.parse(u).hostname;
};

export const isDir = (path) => {
  try {
    return fs.lstatSync(path).isDirectory();
  } catch (e) {
    return false;
  }
};

