import sinon from 'sinon';
import {ConsultantJobCommandBus} from '../../src/ConsultantJob/ConsultantJobCommandBus';
import {ConsultantJobCommandEnum} from '../../src/ConsultantJob/types';
import {assignConsultant} from '../../src/controllers/Consultant';
import {fakeRequest, fakeResponse} from '../tools/TestUtilsHttp';
import {assert} from 'chai';
import {ObjectID} from 'mongodb';

describe('Consultant Controller', () => {
  describe('assignConsultant()', () => {
    const agencyId = 'agency id';
    const clientId = 'some id';
    const id = 'id';
    const payload = {
      consultant_role_id: '6141d9cb9fb4b44d5346914a',
      consultant_id: '6141d9cb9fb4b44d53469150',
      client_ids: ['client id 1']
    };
    const params = {
      agency_id: {
        value: agencyId
      },
      client_id: {
        value: clientId
      },
      assign_consultant_payload: {
        value: payload
      }
    };

    it('success scenario', async () => {
      const req = fakeRequest({
        swaggerParams: params,
        basePathName: '/v1/localhost/path'
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectID.prototype, 'toString').returns(id);

      const execute = sinon.stub(ConsultantJobCommandBus.prototype, 'execute').resolves();

      await assignConsultant(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      assert.deepEqual(
        execute.getCall(0).args,
        [
          agencyId,
          {
            type: ConsultantJobCommandEnum.ASSIGN_CONSULTANT,
            data: {
              _id: id,
              ...payload
            }
          }
        ],
        'ConsultantCommandBus.execute called with incorrect arguments'
      );
    });

    it('failure scenario', async () => {
      const req = fakeRequest({
        swaggerParams: params,
        basePathName: '/v1/localhost/path'
      });
      const res = fakeResponse();
      const next = sinon.spy();

      sinon.stub(ObjectID.prototype, 'toString').returns(id);
      const error = new Error('custom');
      const execute = sinon.stub(ConsultantJobCommandBus.prototype, 'execute').rejects(error);

      await assignConsultant(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      assert.deepEqual(
        execute.getCall(0).args,
        [
          agencyId,
          {
            type: ConsultantJobCommandEnum.ASSIGN_CONSULTANT,
            data: {
              _id: id,
              ...payload
            }
          }
        ],
        'ConsultantCommandBus.execute called with incorrect arguments'
      );
    });
  });
});
