'use strict';

const {RuntimeError} = require('a24-node-error-utils');

/**
 * Assists with doing the audit for the given resource
 */
class AuditHelper {

  constructor(logger, auditor) {
    this.logger = logger;
    this.auditor = auditor;
  }

  /**
   * Produce audit using the passed in configuration object
   *
   * Action will override the default configured audit
   *
   * @param {Object} auditDetails - The audit details object
   * {
   *   'action': action //optional
   *   'resource_type': candidate,
   *   'resource_id': 12345,
   *   'data': data //optional
   * }
   * @param {Function} callback - (err) returns nothing on success
   */
  produceAudit(auditDetails, callback) {
    auditDetails.action = (auditDetails.action) ? auditDetails.action : this.auditor.getEvent();
    this.logger.info(`Audit for action: ${auditDetails.action} started`);
    this.auditor.doAuditCustomEvent(
      auditDetails.action,
      auditDetails.resource_type,
      auditDetails.resource_id,
      auditDetails.data,
      (err) => {
        if (err) {
          this.logger.crit(
            `Audit failed for action: ${auditDetails.action}`,
            {
              'audit_details': auditDetails,
              'original_error': err
            }
          );
          let runtimeError = new RuntimeError(`Error while auditing for action: ${auditDetails.action}`, err);
          return callback(runtimeError);
        }
        this.logger.info(`Audit was successfully done for action: ${auditDetails.action}`);
        return callback();
      });
  }
}

module.exports = AuditHelper;
