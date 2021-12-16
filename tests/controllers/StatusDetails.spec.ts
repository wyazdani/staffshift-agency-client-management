import sinon from 'ts-sinon';
import {fakeRequest, fakeResponse} from '../tools/TestUtilsHttp';
import {getSystemStatus} from '../../src/controllers/StatusDetails';
import {assert} from 'chai';

describe('StatusDetails', () => {
  afterEach(function () {
    sinon.restore();
  });

  describe('getSystemStatus()', function () {
    it('should return uptime on success', async () => {
      const req = fakeRequest({
        swaggerParams: {},
        basePathName: '/v1/localhost/path'
      });
      const res = fakeResponse();
      const setHeader = sinon.stub(res, 'setHeader');
      const end = sinon.stub(res, 'end');

      await getSystemStatus(req, res);
      end.should.have.been.calledOnce;
      const argsObj = JSON.parse(end.getCall(0).args[0]);

      assert.isNumber(argsObj.up_time, 'up_time must be a number');
      setHeader.should.have.been.calledOnceWith('Content-Type', 'application/json');
    });
  });
});
