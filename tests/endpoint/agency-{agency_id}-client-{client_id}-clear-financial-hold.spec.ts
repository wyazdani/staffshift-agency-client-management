import {TestUtilsZSchemaFormatter} from '../tools/TestUtilsZSchemaFormatter';
import ZSchema from 'z-schema';
import {assert} from 'chai';
import {api} from '../tools/TestUtilsApi';
import {getJWT} from '../tools/TestUtilsJwt';
import {cloneDeep} from 'lodash';
import {AgencyClientsProjectionScenarios} from './scenarios/AgencyClientsProjectionScenarios';
import {OrganisationJobScenario} from './scenarios/OrganisationJobScenario';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';
import sinon from 'sinon';

TestUtilsZSchemaFormatter.format();
const validator = new ZSchema({});
const organisationJobScenario = new OrganisationJobScenario(TestUtilsLogger.getLogger(sinon.spy()));

describe('agency-{agency_id}-client-{client_id}-financial-hold', () => {
  const jwtToken = getJWT({
    sub: '5ff6e098fb83732f8e23dc92',
    name: 'John Doe',
    iat: 1516239022
  });
  const payload = {
    note: 'test'
  };
  const headers = {
    'x-request-jwt': jwtToken,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Request-Id': '123'
  };

  afterEach(async () => {
    await AgencyClientsProjectionScenarios.removeAll();
    await organisationJobScenario.deleteAllEvents();
  });

  describe('post', () => {
    const agencyId = '6141d5be5863dc2202000001';
    const clientId = '6141d64365e0e52381000001';

    it('should respond with 202 clears financial hold', async () => {
      await AgencyClientsProjectionScenarios.createRecord({
        agency_id: agencyId
      });
      const res = await api
        .post(`/agency/${agencyId}/client/${clientId}/clear-financial-hold`)
        .set(headers)
        .send(payload);

      res.statusCode.should.equal(202);
    });

    it('should respond with 400 Validation Error', async () => {
      const schema = {
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: {
            type: 'string',
            enum: ['REQUIRED', 'PATTERN', 'SCHEMA_VALIDATION_FAILED', 'MODEL_VALIDATION_FAILED']
          },
          message: {
            type: 'string'
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              required: ['code', 'message', 'path'],
              properties: {
                code: {
                  type: 'string',
                  enum: ['OBJECT_ADDITIONAL_PROPERTIES', 'OBJECT_MISSING_REQUIRED_PROPERTY']
                },
                message: {
                  type: 'string'
                },
                path: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                },
                description: {
                  type: 'string'
                }
              },
              additionalProperties: false
            }
          }
        },
        additionalProperties: false
      };
      const res = await api.post(`/agency/${agencyId}/client/${clientId}/clear-financial-hold`).set(headers).send();

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
      const otherHeaders = cloneDeep(headers);

      otherHeaders['x-request-jwt'] = 'invalid';
      const res = await api
        .post(`/agency/${agencyId}/client/${clientId}/clear-financial-hold`)
        .set(otherHeaders)
        .send(payload);

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

      const res = await api
        .post(`/agency/${agencyId}/client/${clientId}/clear-financial-hold`)
        .set(headers)
        .send(payload);

      res.statusCode.should.equal(404);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });
  });
});
