import sinon from 'sinon';
import {ConsultantAssignProcess} from '../../src/BulkProcessManager/processes/ConsultantAssignProcess';
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
    it('Test not found', () => {
      (() => {
        ProcessFactory.getProcess(TestUtilsLogger.getLogger(sinon.spy()), 'unknown');
      }).should.throw(Error);
    });
  });
});
