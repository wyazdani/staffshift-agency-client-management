import sinon from 'sinon';
import {addAgencyConsultantRole} from '../../src/controllers/AgencyConsultantRole';
import {fakeRequest, fakeResponse} from '../tools/TestUtilsHttp';
import {assert} from 'chai';
import {LocationHelper} from '../../src/helpers/LocationHelper';
import {ObjectID} from 'mongodb';
import {AgencyCommandBus} from '../../src/Agency/AgencyCommandBus';
import {AgencyCommandEnum} from '../../src/Agency/types';

describe('AgencyConsultantRole', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('addAgencyConsultantRole()', () => {
    it('success scenario', async () => {
      const location = 'http://localhost/sample/a/b/c';
      const agencyId = 'agency id';
      const roleId = 'AAA';
      const params = {
        agency_id: {value: agencyId},
        agency_consultant_role_payload: {
          value: {
            name: 'sample_name',
            description: 'some description',
            max_consultants: 2
          }
        }
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const setHeader = sinon.stub(res, 'setHeader');
      const end = sinon.stub(res, 'end');
      const getRelativeLocation = sinon.stub(LocationHelper, 'getRelativeLocation').returns(location);

      sinon.stub(ObjectID.prototype, 'toString').returns(roleId);

      const execute = sinon.stub(AgencyCommandBus.prototype, 'execute').resolves();

      await addAgencyConsultantRole(req, res, next);
      assert.equal(res.statusCode, 202, 'status code expected to be 202');
      assert.deepEqual(setHeader.getCall(0).args, ['Location', location], 'Expected header to be set');
      assert.equal(end.callCount, 1, 'Expected end to be called');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      assert.equal(getRelativeLocation.getCall(0).args[0], `/agency/${agencyId}/consultant-roles/${roleId}`);
      assert.deepEqual(
        execute.getCall(0).args,
        [
          agencyId,
          {
            type: AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE,
            data: {
              _id: roleId,
              name: 'sample_name',
              description: 'some description',
              max_consultants: 2
            }
          }
        ],
        'AgencyCommandBus.execute expected parameters failed'
      );
    });

    it('failure scenario', async () => {
      const agencyId = 'agency id';
      const roleId = 'AAA';
      const params = {
        agency_id: {value: agencyId},
        agency_consultant_role_payload: {
          value: {
            name: 'sample_name',
            description: 'some description',
            max_consultants: 2
          }
        }
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();

      sinon.stub(ObjectID.prototype, 'toString').returns(roleId);
      const error = new Error('custom');
      const execute = sinon.stub(AgencyCommandBus.prototype, 'execute').rejects(error);

      await addAgencyConsultantRole(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called');
      assert.equal(next.getCall(0).args[0], error, 'Expected error to match');
      assert.deepEqual(
        execute.getCall(0).args,
        [
          agencyId,
          {
            type: AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE,
            data: {
              _id: roleId,
              name: 'sample_name',
              description: 'some description',
              max_consultants: 2
            }
          }
        ],
        'AgencyCommandBus.execute expected parameters failed'
      );
    });
  });
});
