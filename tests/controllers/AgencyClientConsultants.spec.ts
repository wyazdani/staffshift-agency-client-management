import sinon from 'sinon';
import {addAgencyClientConsultant} from '../../src/controllers/AgencyClientConsultants';
import {fakeRequest, fakeResponse} from '../tools/TestUtilsHttp';
import {assert} from 'chai';
import {ObjectID} from 'mongodb';
import {AgencyClientCommandEnum} from '../../src/AgencyClient/types';
import {AgencyClientCommandBus} from '../../src/AgencyClient/AgencyClientCommandBus';

describe('AgencyClientConsultants', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('addAgencyClientConsultant()', () => {
    const agencyId = 'agency id';
    const clientId = 'some id';
    const id = 'id';
    const location = `/v1/localhost/path/${id}`;
    const payload = {
      _id: id,
      consultant_role_id: '6141d9cb9fb4b44d5346914a',
      consultant_id: '6141d9cb9fb4b44d53469150'
    };
    const params = {
      agency_id: {
        value: agencyId
      },
      client_id: {
        value: clientId
      },
      assign_client_consultant_payload: {
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
      const setHeader = sinon.stub(res, 'setHeader');
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectID.prototype, 'toString').returns(id);

      const execute = sinon.stub(AgencyClientCommandBus.prototype, 'execute').resolves();

      await addAgencyClientConsultant(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.deepEqual(setHeader.getCall(0).args, ['Location', location], 'Incorrect location header set');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      assert.deepEqual(
        execute.getCall(0).args,
        [
          agencyId,
          clientId,
          {
            type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
            data: payload
          }
        ],
        'AgencyClientCommandBus.execute called with incorrect arguments'
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
      const execute = sinon.stub(AgencyClientCommandBus.prototype, 'execute').rejects(error);

      await addAgencyClientConsultant(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      assert.deepEqual(
        execute.getCall(0).args,
        [
          agencyId,
          clientId,
          {
            type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
            data: payload
          }
        ],
        'AgencyClientCommandBus.execute expected parameters failed'
      );
    });
  });
});
