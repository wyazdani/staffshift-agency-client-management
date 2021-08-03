'use strict';

const StatusDetailsService = require('../../services/StatusDetailsService');
const {expect, assert} = require('chai');
const sinon = require('sinon');

describe('StatusDetailsService test scenarios', function () {

  describe('getSystemStatus(): Gets the status of the service', function () {

    /**
     * Test that the system status is returned
     *
     * @covers services/StatusDetailsService.getSystemStatus
     */
    it('200 response test', function () {
      let args = {};
      let nextSpy = sinon.spy();
      let resSetHeaderSpy = sinon.spy();

      let resEndSpy = sinon.spy(function (response) {
        assert.equal(isNaN(JSON.parse(response).up_time), false, 'Up time was expected to be a number');
      });
      let res = {statusCode: '', setHeader: resSetHeaderSpy, end: resEndSpy};

      let statusService = new StatusDetailsService({});
      statusService.getSystemStatus(args, res, nextSpy);
      expect(nextSpy.callCount).to.equal(0);
      expect(resEndSpy.callCount).to.equal(1);
    });

  });
});