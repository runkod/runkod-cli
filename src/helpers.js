import log from './log';

export const handleApiError = function (err) {
  if (err.response && err.response.data && err.response.data.code) {
    log.error('! ' + err.response.data.code + ' - ' + err.response.data.message);
  } else {
    console.error('Server Error');
  }
};


export const resolveProject = (projects, val) => {
  const byId = projects.find((x) => x.id === val);
  if (byId) {
    return byId;
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
