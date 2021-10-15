import {TestUtilsZSchemaFormatter} from '../tools/TestUtilsZSchemaFormatter';
import ZSchema from 'z-schema';
import {assert} from 'chai';
import {api} from '../tools/TestUtilsApi';
import {getJWT} from '../tools/TestUtilsJwt';
import _ from 'lodash';
import {AgencyClientScenario} from './scenarios/AgencyClientScenario';
import {AgencyConsultantRoleScenario} from './scenarios/AgencyConsultantRoleScenario';

TestUtilsZSchemaFormatter.format();
const validator = new ZSchema({});

describe('agency-{agency_id}-clients-{client_id}-consultants-{consultant_id}', () => {
  const jwtToken = getJWT({
    sub: '5ff6e098fb83732f8e23dc92',
    name: 'John Doe',
    iat: 1516239022
  });
  const headers = {
    'x-request-jwt': jwtToken,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Request-Id': '123'
  };
  const agencyClientScenario = new AgencyClientScenario();
  const agencyConsultantRoleScenario = new AgencyConsultantRoleScenario();

  afterEach(async () => {
    await agencyClientScenario.deleteAllEvents();
  });

  describe('delete', () => {
    const agencyId = '6141caa0d51653b8f4000001';
    const clientId = '61546ad7487f521523000001';
    const consultantRoleId = '6154703039004ecec7000001';
    const consultantId = '61546b06e078011a14000001';
    const consultantRecordId = '6154754f76a9633a16000001';

    it('should respond with 202 removes an Agency Client Consultant', async () => {
      await agencyClientScenario.linkAgencyClient(agencyId, clientId);
      await agencyConsultantRoleScenario.addAgencyConsultantRole(agencyId, consultantRoleId);
      await agencyClientScenario.addAgencyClientConsultant({
        agencyId: agencyId,
        clientId: clientId,
        consultantId: consultantId,
        consultantRecordId: consultantRecordId,
        consultantRoleId: consultantRoleId
      });
      const res = await api
        .del(`/agency/${agencyId}/clients/${clientId}/consultants/${consultantRecordId}`)
        .set(headers)
        .send();

      res.statusCode.should.to.equal(202);
    });

    it('should respond with 400 Validation Error', async () => {
      const schema = {
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: {
            type: 'string',
            enum: ['REQUIRED', 'PATTERN']
          },
          message: {
            type: 'string'
          }
        },
        additionalProperties: false
      };
      const res = await api.del(`/agency/${agencyId}/clients/${clientId}/consultants/44444`).set(headers).send();

      assert.equal(res.statusCode, 400);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });

    it('should respond with 401 Failed to authenticate', async () => {
      const schema = {
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: {
            type: 'string',
            enum: ['UNAUTHORIZED']
          },
          message: {
            type: 'string'
          }
        },
        additionalProperties: false
      };
      const otherHeaders = _.cloneDeep(headers);

      otherHeaders['x-request-jwt'] = 'invalid';
      const res = await api
        .del(`/agency/${agencyId}/clients/${clientId}/consultants/${consultantRecordId}`)
        .set(otherHeaders)
        .send();

      assert.equal(res.statusCode, 401);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });

    it('should respond with 404', async () => {
      const schema = {
        description: 'No resource found',
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: {
            type: 'string',
            enum: ['RESOURCE_NOT_FOUND']
          },
          message: {
            type: 'string'
          }
        },
        additionalProperties: false
      };

      await agencyClientScenario.linkAgencyClient(agencyId, clientId);
      const res = await api
        .del(`/agency/${agencyId}/clients/${clientId}/consultants/${consultantRecordId}`)
        .set(headers)
        .send();

      res.statusCode.should.to.equal(404);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });
  });
});
