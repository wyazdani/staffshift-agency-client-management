import {LocationHelper} from '../../src/helpers/LocationHelper';
import {TestUtilsZSchemaFormatter} from '../tools/TestUtilsZSchemaFormatter';
import ZSchema from 'z-schema';
import {AgencyClientsProjectionScenarios} from './scenarios/AgencyClientsProjectionScenarios';
import {assert} from 'chai';
import {api} from '../tools/TestUtilsApi';
import {getJWT} from '../tools/TestUtilsJwt';

TestUtilsZSchemaFormatter.format();
const validator = new ZSchema({});

describe('/agency/{agency_id}/consultant-roles', () => {
  const jwtToken = getJWT();
  const headers = {
    'x-request-jwt': jwtToken,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Request-Id': '123'
  };

  describe('post', () => {
    const agencyId = '6141caa0d51653b8f4000001';

    it('should respond with 200 Creates an Agency Consultant Role', async () => {
      const res = await api.post(`/agency/${agencyId}/consultant-roles`).set(headers).send({
        name: 'ok',
        description: 'description',
        max_consultants: 2
      });

      res.statusCode.should.to.equal(202);
      res.get('Location').should.to.equal(LocationHelper.getRelativeLocation(`/agency/${agencyId}/consultant-roles`));
      assert.equal(res.body[0].agency_id, agencyId);

      //@TODO: CONTINUE WRITING ENDPOINT TEST CASES HERE
    });
  });
});
