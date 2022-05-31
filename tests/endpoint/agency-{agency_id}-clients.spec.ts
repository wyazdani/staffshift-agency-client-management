import {TestUtilsZSchemaFormatter} from '../tools/TestUtilsZSchemaFormatter';
import ZSchema from 'z-schema';
import {AgencyClientsProjectionScenarios} from './scenarios/AgencyClientsProjectionScenarios';
import {assert} from 'chai';
import {api} from '../tools/TestUtilsApi';
import {getJWT} from '../tools/TestUtilsJwt';

TestUtilsZSchemaFormatter.format();
const validator = new ZSchema({});

describe('/agency/{agency_id}/clients', () => {
  const jwtToken = getJWT();
  const headers = {
    'x-request-jwt': jwtToken,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Request-Id': '123'
  };

  describe('get', () => {
    const agencyId = '6141caa0d51653b8f4000001';

    beforeEach(async () => {
      await AgencyClientsProjectionScenarios.removeAll();
    });
    /*eslint-disable*/
    const schema = {
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "_id",
          "agency_id",
          "client_id",
          "client_type",
          "linked",
          "created_at",
          "updated_at"
        ],
        "properties": {
          "_id": {
            "type": "string"
          },
          "agency_id": {
            "type": "string"
          },
          "client_id": {
            "type": "string"
          },
          "organisation_id": {
            "type": "string"
          },
          "site_id": {
            "type": "string"
          },
          "client_type": {
            "type": "string"
          },
          "linked": {
            "type": "boolean"
          },
          "created_at": {
            "type": "string"
          },
          "updated_at": {
            "type": "string"
          }
        },
        "additionalProperties": false
      }
    };

    /*eslint-enable*/
    it('should respond with 200 success response.', async () => {
      await AgencyClientsProjectionScenarios.createRecord({
        agency_id: agencyId
      });
      const res = await api.get(`/agency/${agencyId}/clients`).set(headers);

      res.statusCode.should.equal(200);
      validator.validate(res.body, schema).should.be.true;
      assert.equal(res.body[0].agency_id, agencyId);
    });

    it('should respond with 200 success response when we pass multiple client ids', async () => {
      const clientIdA = '6296130c58df6184f3000001';
      const clientIdB = '6296131cdf63544c1c000001';
      const clientIdC = '6296139ba74cf4861a000001';

      await AgencyClientsProjectionScenarios.createRecord({
        agency_id: agencyId,
        client_id: clientIdA
      });
      await AgencyClientsProjectionScenarios.createRecord({
        agency_id: agencyId,
        client_id: clientIdB
      });
      await AgencyClientsProjectionScenarios.createRecord({
        agency_id: agencyId,
        client_id: clientIdC
      });
      const res = await api
        .get(`/agency/${agencyId}/clients`)
        .query({
          client_id: [clientIdA, clientIdB]
        })
        .set(headers);

      res.statusCode.should.equal(200);
      validator.validate(res.body, schema).should.be.true;
      assert.equal(res.body.length, 2);
    });
  });
});
