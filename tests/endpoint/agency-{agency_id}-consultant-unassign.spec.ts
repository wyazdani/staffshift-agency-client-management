import {TestUtilsZSchemaFormatter} from '../tools/TestUtilsZSchemaFormatter';
import ZSchema from 'z-schema';
import {assert} from 'chai';
import {api} from '../tools/TestUtilsApi';
import {getJWT} from '../tools/TestUtilsJwt';
import _ from 'lodash';
import {AgencyConsultantRoleScenario} from './scenarios/AgencyConsultantRoleScenario';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';
import sinon from 'sinon';

TestUtilsZSchemaFormatter.format();
const validator = new ZSchema({});

describe('/agency/{agency_id}/consultant-unassign', () => {
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
  const consultantId = '621749f165790ab688000001';
  const consultantRoleId = '62174a9acdec53ad71000001';
  const clientIds = ['62174a05b8a25337f4000001'];
  const agencyConsultantRoleScenario = new AgencyConsultantRoleScenario(TestUtilsLogger.getLogger(sinon.spy()));

  afterEach(async () => {
    await agencyConsultantRoleScenario.deleteAllEvents();
  });
  describe('post', () => {
    it('should respond with 202 Unassign consultant to multiple clients', async () => {
      const res = await api.post(`/agency/${agencyId}/consultant-unassign`).set(headers).send({
        consultant_id: consultantId,
        consultant_role_id: consultantRoleId,
        client_ids: clientIds
      });

      res.statusCode.should.equal(202);
    });

    it('should respond with 400 Validation Error', async () => {
      const schema = {
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: {
            type: 'string',
            enum: ['REQUIRED', 'MODEL_VALIDATION_FAILED', 'SCHEMA_VALIDATION_FAILED', 'PATTERN']
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
                  enum: [
                    'INVALID_TYPE',
                    'PATTERN',
                    'OBJECT_ADDITIONAL_PROPERTIES',
                    'OBJECT_MISSING_REQUIRED_PROPERTY',
                    'ARRAY_LENGTH_SHORT',
                    'ARRAY_UNIQUE',
                    'ANOTHER_CONSULTANT_PROCESS_ACTIVE'
                  ]
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
      const res = await api.post(`/agency/${agencyId}/consultant-unassign`).set(headers).send({
        consultant_id: consultantId,
        consultant_role_id: consultantRoleId,
        client_ids: []
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
      const res = await api.post(`/agency/${agencyId}/consultant-unassign`).set(otherHeaders).send({
        consultant_id: consultantId,
        consultant_role_id: consultantRoleId,
        client_ids: clientIds
      });

      assert.equal(res.statusCode, 401);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });
  });
});
