import sinon from 'sinon';
import {ConsultantAssignProcess} from '../../src/BulkProcessManager/processes/ConsultantAssignProcess/ConsultantAssignProcess';
import {ConsultantTransferProcess} from '../../src/BulkProcessManager/processes/ConsultantTransferProcess/ConsultantTransferProcess';
import {ConsultantUnassignProcess} from '../../src/BulkProcessManager/processes/ConsultantUnassignProcess/ConsultantUnassignProcess';
import {InheritFinancialHoldProcess} from '../../src/BulkProcessManager/processes/FinancialHold/InheritFinancialHoldProcess/InheritFinancialHoldProcess';
import {SetFinancialHoldProcess} from '../../src/BulkProcessManager/processes/FinancialHold/SetFinancialHoldProcess/SetFinancialHoldProcess';
import {ApplyPaymentTermProcess} from '../../src/BulkProcessManager/processes/PaymentTerm/ApplyPaymentTermProcess/ApplyPaymentTermProcess';
import {InheritPaymentTermProcess} from '../../src/BulkProcessManager/processes/PaymentTerm/InheritPaymentTermProcess/InheritPaymentTermProcess';
import {ProcessFactory} from '../../src/BulkProcessManager/ProcessFactory';
import {EventsEnum} from '../../src/Events';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';

describe('ProcessFactory', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('getProcess', () => {
    it('Test CONSULTANT_JOB_ASSIGN_INITIATED', () => {
      const process = ProcessFactory.getProcess(
        TestUtilsLogger.getLogger(sinon.spy()),
        EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED
      );

      process.should.be.instanceof(ConsultantAssignProcess);
    });

    it('Test CONSULTANT_JOB_UNASSIGN_INITIATED', () => {
      const process = ProcessFactory.getProcess(
        TestUtilsLogger.getLogger(sinon.spy()),
        EventsEnum.CONSULTANT_JOB_UNASSIGN_INITIATED
      );

      process.should.be.instanceof(ConsultantUnassignProcess);
    });

    it('Test CONSULTANT_JOB_TRANSFER_INITIATED', () => {
      const process = ProcessFactory.getProcess(
        TestUtilsLogger.getLogger(sinon.spy()),
        EventsEnum.CONSULTANT_JOB_TRANSFER_INITIATED
      );

      process.should.be.instanceof(ConsultantTransferProcess);
    });

    it('Test AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED', () => {
      const process = ProcessFactory.getProcess(
        TestUtilsLogger.getLogger(sinon.spy()),
        EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED
      );

      process.should.be.instanceof(ApplyPaymentTermProcess);
    });

    it('Test AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_INITIATED', () => {
      const process = ProcessFactory.getProcess(
        TestUtilsLogger.getLogger(sinon.spy()),
        EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_INITIATED
      );

      process.should.be.instanceof(InheritPaymentTermProcess);
    });

    it('Test AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INITIATED', () => {
      const process = ProcessFactory.getProcess(
        TestUtilsLogger.getLogger(sinon.spy()),
        EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INITIATED
      );

      process.should.be.instanceof(SetFinancialHoldProcess);
    });

    it('Test AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INITIATED', () => {
      const process = ProcessFactory.getProcess(
        TestUtilsLogger.getLogger(sinon.spy()),
        EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INITIATED
      );

      process.should.be.instanceof(SetFinancialHoldProcess);
    });

    it('Test AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_INITIATED', () => {
      const process = ProcessFactory.getProcess(
        TestUtilsLogger.getLogger(sinon.spy()),
        EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_INITIATED
      );

      process.should.be.instanceof(InheritFinancialHoldProcess);
    });

    it('Test not found', () => {
      (() => {
        ProcessFactory.getProcess(TestUtilsLogger.getLogger(sinon.spy()), 'unknown');
      }).should.throw(Error);
    });
  });
});
