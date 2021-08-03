'use strict';

const {assert} = require('chai');
const sinon = require('sinon');
const {yieldsAsync, logger} = require('../../tools/TestUtils');
const {RuntimeError} = require('a24-node-error-utils');
const AuditHelper = require('../../helpers/AuditHelper');

describe('AuditHelper test scenarios', () => {

  let logSpy;
  beforeEach(() => {
    logSpy = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
    logSpy = null;
  });

  /**
   * Test success scenario without data and default event
   *
   * @author Ruan <ruan.robson@a24group.com>
   * @since 30 July 2021
   *
   * @covers AuditHelper.produceAudit
   */
  it('success scenario without data and default event', (done) => {
    let auditor = {
      doAuditCustomEvent: () => {},
      getEvent: () => {
        return 'mock_event';
      }
    };
    let doAuditCustomEvent = sinon.stub(auditor, 'doAuditCustomEvent');
    doAuditCustomEvent.callsFake((action, type, id, data, callback) => {
      assert.deepEqual(action, 'mock_event', 'Expected the default event to be used');
      assert.deepEqual(type, 'magic', 'Expected the passed details to be used');
      assert.deepEqual(id, 'mike', 'Expected the passed details to be used');
      assert.isUndefined(data, 'No data has been passed');
      yieldsAsync(callback);
    });

    let mockAuditDetails = {
      resource_type: 'magic',
      resource_id: 'mike'
    };
    let auditHelperInstance = new AuditHelper(logger.getLogger(logSpy), auditor);
    auditHelperInstance.produceAudit(mockAuditDetails, (error) => {
      assert.isUndefined(error, 'No error should be returned');
      done();
    });
  });

  /**
   * Test success scenario with data and default event
   *
   * @author Ruan <ruan.robson@a24group.com>
   * @since 30 July 2021
   *
   * @covers AuditHelper.produceAudit
   */
  it('success scenario with data and default event', (done) => {
    let auditor = {
      doAuditCustomEvent: () => {},
      getEvent: () => {
        return 'mock_event';
      }
    };
    let doAuditCustomEvent = sinon.stub(auditor, 'doAuditCustomEvent');
    doAuditCustomEvent.callsFake((action, type, id, data, callback) => {
      assert.deepEqual(action, 'existential', 'Expected the default event to be used');
      assert.deepEqual(type, 'magic', 'Expected the passed details to be used');
      assert.deepEqual(id, 'mike', 'Expected the passed details to be used');
      assert.isDefined(data, 'Data has been passed');
      assert.isTrue(data.exist, 'Data has been passed');
      yieldsAsync(callback);
    });

    let mockAuditDetails = {
      action: 'existential',
      resource_type: 'magic',
      resource_id: 'mike',
      data: {
        exist: true
      }
    };
    let auditHelperInstance = new AuditHelper(logger.getLogger(logSpy), auditor);
    auditHelperInstance.produceAudit(mockAuditDetails, (error) => {
      assert.isUndefined(error, 'No error should be returned');
      done();
    });
  });

  /**
   * Test failure scenario with data and default event
   *
   * @author Ruan <ruan.robson@a24group.com>
   * @since 30 July 2021
   *
   * @covers AuditHelper.produceAudit
   */
  it('Test failure scenario with data and default event', (done) => {
    let auditor = {
      doAuditCustomEvent: () => {},
      getEvent: () => {
        return 'mock_event';
      }
    };
    let mockError = new Error('BOOM');
    let doAuditCustomEvent = sinon.stub(auditor, 'doAuditCustomEvent');
    doAuditCustomEvent.callsFake((action, type, id, data, callback) => {
      assert.deepEqual(action, 'existential', 'Expected the default event to be used');
      assert.deepEqual(type, 'magic', 'Expected the passed details to be used');
      assert.deepEqual(id, 'mike', 'Expected the passed details to be used');
      assert.isDefined(data, 'Data has been passed');
      assert.isTrue(data.exist, 'Data has been passed');
      yieldsAsync(callback, mockError);
    });

    let mockAuditDetails = {
      action: 'existential',
      resource_type: 'magic',
      resource_id: 'mike',
      data: {
        exist: true
      }
    };
    let auditHelperInstance = new AuditHelper(logger.getLogger(logSpy), auditor);
    auditHelperInstance.produceAudit(mockAuditDetails, (error) => {
      assert.isDefined(error, 'Error should be returned');
      assert.instanceOf(error, RuntimeError, 'Expected the error to be wrapped in a RunTime Error');
      done();
    });
  });
});
