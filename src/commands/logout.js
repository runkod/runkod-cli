import log from '../log';
import {_t} from '../i18n';

module.exports = (self) => {
  self._setCredential(null);
  log.success(_t('logout.message'));
};
