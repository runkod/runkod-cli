import log from '../log';

module.exports = async (self, config) => {
  const resp = await config.api.me();
  if (resp.code) {
    log.error(resp.message);
    return;
  }

  log.bold(resp.name + ' <' + resp.email + '>');
};
