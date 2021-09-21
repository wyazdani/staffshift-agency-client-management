import {LoggerContext} from 'a24-logzio-winston';
import {RuntimeError} from 'a24-node-error-utils';
import {GenericObjectInterface} from 'GenericObjectInterface';

interface AuditInterface {
  action: string,
  resource_type: string,
  resource_id: string,
  data: GenericObjectInterface
}
/**
 * Assists with doing the audit for the given resource
 */
export class AuditHelper {
  constructor(private logger: typeof LoggerContext, private auditor: any) {
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
  produceAudit(auditDetails: AuditInterface, callback: (error?: Error) => void) {
    auditDetails.action = (auditDetails.action) ? auditDetails.action : this.auditor.getEvent();
    this.logger.info(`Audit for action: ${auditDetails.action} started`);
    this.auditor.doAuditCustomEvent(
      auditDetails.action,
      auditDetails.resource_type,
      auditDetails.resource_id,
      auditDetails.data,
      (err: Error) => {
        if (err) {
          this.logger.crit(
            `Audit failed for action: ${auditDetails.action}`,
            {
              'audit_details': auditDetails,
              'original_error': err
            }
          );
          const runtimeError = new RuntimeError(`Error while auditing for action: ${auditDetails.action}`, err);
          return callback(runtimeError);
        }
        this.logger.info(`Audit was successfully done for action: ${auditDetails.action}`);
        return callback();
      });
  }
}