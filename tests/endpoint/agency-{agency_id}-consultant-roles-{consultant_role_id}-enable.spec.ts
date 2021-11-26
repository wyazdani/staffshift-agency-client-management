import {TestUtilsZSchemaFormatter} from '../tools/TestUtilsZSchemaFormatter';
import ZSchema from 'z-schema';
import {assert} from 'chai';
import {api} from '../tools/TestUtilsApi';
import {getJWT} from '../tools/TestUtilsJwt';
import _ from 'lodash';
import {AgencyConsultantRoleScenario} from './scenarios/AgencyConsultantRoleScenario';
import {AgencyConsultantRolesProjectionScenarios} from './scenarios/AgencyConsultantRolesProjectionScenarios';

TestUtilsZSchemaFormatter.format();
const validator = new ZSchema({});

describe('/agency/{agency_id}/consultant-roles/{consultant_role_id}/enable', () => {
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
  const roleId = '6152f82071c29edaa4000001';
  const agencyConsultantRoleScenario = new AgencyConsultantRoleScenario();

  afterEach(async () => {
    await agencyConsultantRoleScenario.deleteAllEvents();
    await AgencyConsultantRolesProjectionScenarios.removeAll();
  });

  describe('post', () => {
    it('should respond with 202 Enable an agency client consultant', async () => {
      await agencyConsultantRoleScenario.addAgencyConsultantRole(agencyId, roleId);
      const res = await api.post(`/agency/${agencyId}/consultant-roles/${roleId}/enable`).set(headers).send({});

      res.statusCode.should.be.equal(202);
    });

    it('should respond with 404 resource not found', async () => {
      const errorMessage = {
        message: 'Consultant role not found'
      };
      const res = await api.post(`/agency/${agencyId}/consultant-roles/${roleId}/enable`).set(headers).send({});

      assert.equal(res.statusCode, 404);
      assert.isTrue(validator.validate(res.body, errorMessage), 'response error message expected to be valid');
    });

    it('should response with 400 validation error', async () => {
      const schema = {
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: {
            type: 'string',
            enum: ['SCHEMA_VALIDATION_FAILED', 'MODEL_VALIDATION_FAILED']
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
                  enum: ['OBJECT_ADDITIONAL_PROPERTIES']
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
      const res = await api.post(`/agency/${agencyId}/consultant-roles/${roleId}/enable`).set(headers).send({
        description: 'description'
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
        },
        additionalProperties: false
      };
      const otherHeaders = _.cloneDeep(headers);

      otherHeaders['x-request-jwt'] = 'invalid';
      const res = await api.post(`/agency/${agencyId}/consultant-roles/${roleId}/enable`).set(otherHeaders).send({});

      assert.equal(res.statusCode, 401);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });
  });
});
