'use strict';

module.exports = {
  /**
   * Basic wrapper to allow test cases to trigger callbacks outside the same execution loop
   *
   * @param {Function} callback the callback that will have all the args given passed onto it
   * @param {Any} args the args that will be passed onto the callback function.
   */
  yieldsAsync: function yieldsAsync(callback, ...args) {
    setTimeout(() => {
      callback(...args);
    }, 1);
  },
  logger: {
    getLogger: function logger(logSpy) {
      return {
        'requestId': 'd19d1476-40c3-413a-95e7-9b16e7e93f4f',
        'debug': logSpy,
        'error': logSpy,
        'info': logSpy,
        'warning': logSpy,
        'crit': logSpy,
        'notice': logSpy
      };
    }
  },
  auditor: {
    getAuditor(auditSpy) {
      return {
        getEvent: function getEvent() {
          return 'randomEvent';
        },
        doAuditCustomEvent: auditSpy,
        produceAudit: auditSpy
      };
    }
  }
};
