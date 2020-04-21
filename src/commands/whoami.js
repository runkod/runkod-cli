import * as log from '../log';

module.exports = async (self, config) => {
  const me = await config.api.me();
  if (!me) {
    return;
  }

  log.bold(me.name + ' <' + me.email + '>');
};
