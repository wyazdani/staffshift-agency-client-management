import {LoggerContext} from 'a24-logzio-winston';
import {EventsEnum} from '../Events';
import {ConsultantAssignProcess} from './processes/ConsultantAssignProcess/ConsultantAssignProcess';
import {ConsultantTransferProcess} from './processes/ConsultantTransferProcess/ConsultantTransferProcess';
import {ConsultantUnassignProcess} from './processes/ConsultantUnassignProcess/ConsultantUnassignProcess';
import {InheritFinancialHoldProcess} from './processes/FinancialHold/InheritFinancialHoldProcess/InheritFinancialHoldProcess';
import {
  SetFinancialHoldProcess,
  FinancialHoldProcessTypeEnum
} from './processes/FinancialHold/SetFinancialHoldProcess/SetFinancialHoldProcess';
import {ApplyPaymentTermProcess} from './processes/PaymentTerm/ApplyPaymentTermProcess/ApplyPaymentTermProcess';
import {InheritPaymentTermProcess} from './processes/PaymentTerm/InheritPaymentTermProcess/InheritPaymentTermProcess';
import {ProcessInterface} from './types/ProcessInterface';

export class ProcessFactory {
  static getProcess(logger: LoggerContext, eventType: string): ProcessInterface {
    switch (eventType) {
      case EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED:
        return new ConsultantAssignProcess(logger, {
          maxRetry: 5,
          retryDelay: 10000
        });
      case EventsEnum.CONSULTANT_JOB_UNASSIGN_INITIATED:
        return new ConsultantUnassignProcess(logger, {
          maxRetry: 5,
          retryDelay: 10000
        });
      case EventsEnum.CONSULTANT_JOB_TRANSFER_INITIATED:
        return new ConsultantTransferProcess(logger, {
          maxRetry: 5,
          retryDelay: 10000
        });
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED:
        return new ApplyPaymentTermProcess(logger, {
          maxRetry: 5,
          retryDelay: 10000
        });
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_INITIATED:
        return new InheritPaymentTermProcess(logger, {
          maxRetry: 5,
          retryDelay: 10000
        });
      case EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INITIATED:
        return new SetFinancialHoldProcess(logger, FinancialHoldProcessTypeEnum.APPLY, {
          maxRetry: 5,
          retryDelay: 10000
        });
      case EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INITIATED:
        return new SetFinancialHoldProcess(logger, FinancialHoldProcessTypeEnum.CLEAR, {
          maxRetry: 5,
          retryDelay: 10000
        });
      case EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_INITIATED:
        return new InheritFinancialHoldProcess(logger, {
          maxRetry: 5,
          retryDelay: 10000
        });
      default:
        throw new Error(`no process found for ${eventType}`);
    }
  }
}
