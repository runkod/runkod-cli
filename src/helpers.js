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
