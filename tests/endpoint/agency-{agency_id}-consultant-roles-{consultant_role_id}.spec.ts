import {TestUtilsZSchemaFormatter} from '../tools/TestUtilsZSchemaFormatter';
import ZSchema from 'z-schema';
import {assert} from 'chai';
import {api} from '../tools/TestUtilsApi';
import {getJWT} from '../tools/TestUtilsJwt';
import _ from 'lodash';
import {AgencyConsultantRoleScenario} from './scenarios/AgencyConsultantRoleScenario';

TestUtilsZSchemaFormatter.format();
const validator = new ZSchema({});

describe('/agency/{agency_id}/consultant-roles/{consultant_role_id}', () => {
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
  const agencyConsultantRoleScenario = new AgencyConsultantRoleScenario();

  describe('patch', () => {
    const agencyId = '6141caa0d51653b8f4000001';
    const roleId = '6152f82071c29edaa4000001';

    afterEach(async () => {
      await agencyConsultantRoleScenario.deleteAllEvents();
    });
    it('should respond with 202 Updates an Agency Consultant Role', async () => {
      await agencyConsultantRoleScenario.addAgencyConsultantRole(agencyId, roleId);
      const resEndpoint = await api.patch(`/agency/${agencyId}/consultant-roles/${roleId}`).set(headers).send({
        name: 'ok',
        description: 'description',
        max_consultants: 2
      });

      resEndpoint.statusCode.should.to.equal(202);
    });

    it('should respond with 400 Validation Error', async () => {
      const schema = {
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: {
            type: 'string',
            enum: ['SCHEMA_VALIDATION_FAILED', 'MODEL_VALIDATION_FAILED', 'PATTERN', 'REQUIRED']
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
                  enum: ['INVALID_TYPE', 'MINIMUM', 'OBJECT_ADDITIONAL_PROPERTIES', 'OBJECT_MISSING_REQUIRED_PROPERTY']
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
      const res = await api.patch(`/agency/${agencyId}/consultant-roles/${roleId}`).set(headers).send({
        name: 'ok',
        description: 'description',
        max_consultants: 0
      });

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
        }
      };
      const otherHeaders = _.cloneDeep(headers);

      otherHeaders['x-request-jwt'] = 'invalid';
      const res = await api.patch(`/agency/${agencyId}/consultant-roles/${roleId}`).set(otherHeaders).send({
        name: 'ok',
        description: 'description',
        max_consultants: 2
      });

      assert.equal(res.statusCode, 401);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });

    it('should respond with 404 resource not found', async () => {
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
        }
      };
      const res = await api.patch(`/agency/${agencyId}/consultant-roles/${roleId}`).set(headers).send({
        name: 'ok',
        description: 'description',
        max_consultants: 2
      });

      assert.equal(res.statusCode, 404);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });
  });
});
