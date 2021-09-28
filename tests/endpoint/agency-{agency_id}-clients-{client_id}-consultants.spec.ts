import {TestUtilsZSchemaFormatter} from '../tools/TestUtilsZSchemaFormatter';
import ZSchema from 'z-schema';
import {assert} from 'chai';
import {api} from '../tools/TestUtilsApi';
import {getJWT} from '../tools/TestUtilsJwt';
import _ from 'lodash';
import {CreateAgencyClientLinkScenario} from './scenarios/CreateAgencyClientLinkScenario';
import {CreateAgencyConsultantRoleScenario} from './scenarios/CreateAgencyConsultantRoleScenario';

TestUtilsZSchemaFormatter.format();
const validator = new ZSchema({});

describe('/agency/{agency_id}/clients/{client_id}/consultants', () => {
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
  const agencyId = '6141caa0d51653b8f4000001';
  const clientId = '6141d9cb9fb4b44d53469159';
  const roleId = '6151ada2ff873ad464bdd33c';

  beforeEach(async () => {
    await CreateAgencyConsultantRoleScenario.createAggregateEvents(agencyId, roleId);
    await CreateAgencyClientLinkScenario.createAggregateEvents(agencyId, clientId);
  });

  afterEach(async () => {
    await CreateAgencyConsultantRoleScenario.removeAggregateEvents(agencyId);
    await CreateAgencyClientLinkScenario.removeAggregateEvents(agencyId, clientId);
  });

  describe('post', () => {
    it('should respond with 202 assign an agency client consultant', async () => {
      const res = await api.post(`/agency/${agencyId}/clients/${clientId}/consultants`).set(headers).send({
        consultant_role_id: roleId,
        consultant_id: '61432f88d7667e06d38e73b4'
      });

      res.statusCode.should.be.equal(202);
      const location = res.get('Location');

      assert.match(
        location,
        /\/v1\/agency\/6141caa0d51653b8f4000001\/clients\/6141d9cb9fb4b44d53469159\/consultants\/[0-9a-fA-F]{24}/g,
        'Location header does not match expected string'
      );
    });

    it('should respond with 400 Validation Error', async () => {
      const schema = {
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: {
            type: 'string',
            enum: ['REQUIRED', 'SCHEMA_VALIDATION_FAILED']
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
                  enum: ['INVALID_TYPE', 'PATTERN', 'OBJECT_ADDITIONAL_PROPERTIES', 'OBJECT_MISSING_REQUIRED_PROPERTY']
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
              }
            }
          }
        }
      };
      const res = await api.post(`/agency/${agencyId}/clients/${clientId}/consultants`).set(headers).send({
        consultant_role_id: 'blah',
        consultant_id: 'meh'
      });

      assert.equal(res.statusCode, 400);
      assert.isTrue(validator.validate(res.body, schema), 'response does not match expected schema');
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
        }
      };
      const headersClone = _.cloneDeep(headers);

      headersClone['x-request-jwt'] = 'invalid';
      const res = await api.post(`/agency/${agencyId}/clients/${clientId}/consultants`).set(headersClone).send({
        consultant_role_id: '6151ada2ff873ad464bdd33c',
        consultant_id: '61432f88d7667e06d38e73b4'
      });

      assert.equal(res.statusCode, 401);
      assert.isTrue(validator.validate(res.body, schema), 'response does not match expected schema');
    });
  });
});
