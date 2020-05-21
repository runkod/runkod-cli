import path from 'path';
import fs from 'fs';
import * as log from './log'

export const resolveProject = (projects, val) => {
  const byId = projects.find((x) => x.id === val);
  if (byId) {
    return byId;
  }

  const byAddress = projects.find((x) => x.address === val);
  if (byAddress) {
    return byAddress;
  }

  const byName = projects.find((x) => x.name === val);
  if (byName) {
    return byName;
  }

  const byDomainName = projects.find((x) => x.domainRecord && x.domainRecord.name === val);
  if (byDomainName) {
    return byDomainName;
  }

  return null;
};

export const readFileArgs = () => {
  const rFilePath = path.join(process.cwd(), '.runkod');

  if (!fs.existsSync(rFilePath)) {
    return {};
  }

  const raw = fs.readFileSync(rFilePath, 'utf-8');
  let obj = {};
  try {
    obj = JSON.parse(raw);
  } catch (e) {
    log.warning("Warning: '.runkod' file has wrong format. JSON format required!");
    return {};
  }

  const project = obj?.p || obj?.project;
  const folder = obj?.f || obj?.folder;
  const activate = obj?.a || obj?.activate;

  const rv = {};

  if (project) {
    rv.p = project;
    rv.project = project;
  }

  if (folder) {
    rv.f = folder;
    rv.folder = folder;
  }

  if (activate) {
    rv.a = activate;
    rv.activate = activate
  }

  return rv;
};
