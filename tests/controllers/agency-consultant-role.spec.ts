import sinon from 'sinon';
import {addAgencyConsultantRole} from '../../src/controllers/AgencyConsultantRole';
import {fakeRequest, fakeResponse} from '../tools/TestUtilsHttp';
import {assert} from 'chai';
import {LocationHelper} from '../../src/helpers/LocationHelper';
import {ObjectID} from 'mongodb';

describe('AgencyConsultantRole', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('addAgencyConsultantRole()', () => {
    it('success scenario', async () => {
      const location = 'http://localhost/sample/a/b/c';
      const agencyId = 'agency id';
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

      sinon.stub(ObjectID.prototype, 'toString').returns('AAA');
      await addAgencyConsultantRole(req, res, next);
      assert.equal(res.statusCode, 202, 'status code expected to be 202');
      assert.deepEqual(setHeader.getCall(0).args, ['Location', location], 'Expected header to be set');
      assert.equal(end.callCount, 1, 'Expected end to be called');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      assert.equal(getRelativeLocation.getCall(0).args[0], `/agency/${agencyId}/consultant-roles/AAA`);
    });
  });
});
