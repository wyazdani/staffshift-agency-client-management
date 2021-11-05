import {TestUtilsZSchemaFormatter} from '../tools/TestUtilsZSchemaFormatter';
import ZSchema from 'z-schema';
import {assert} from 'chai';
import {api} from '../tools/TestUtilsApi';
import {getJWT} from '../tools/TestUtilsJwt';
import _ from 'lodash';
import {AgencyConsultantRolesProjectionScenarios} from './scenarios/AgencyConsultantRolesProjectionScenarios';

TestUtilsZSchemaFormatter.format();
const validator = new ZSchema({});

describe('/agency/{agency_id}/consultant-roles', () => {
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

  describe('post', () => {
    it('should respond with 202 Creates an Agency Consultant Role', async () => {
      const res = await api.post(`/agency/${agencyId}/consultant-roles`).set(headers).send({
        name: 'ok',
        description: 'description',
        max_consultants: 2
      });

      res.statusCode.should.equal(202);
      const location = res.get('Location');

      assert.match(
        location,
        /\/v1\/agency\/6141caa0d51653b8f4000001\/consultant-roles\/[0-9a-fA-F]{24}/g,
        'Expected location to match'
      );
    });

    it('should respond with 400 Validation Error', async () => {
      const schema = {
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: {
            type: 'string'
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
              },
              additionalProperties: false
            }
          }
        },
        additionalProperties: false
      };
      const res = await api.post(`/agency/${agencyId}/consultant-roles`).set(headers).send({
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
        },
        additionalProperties: false
      };
      const otherHeaders = _.cloneDeep(headers);

      otherHeaders['x-request-jwt'] = 'invalid';
      const res = await api.post(`/agency/${agencyId}/consultant-roles`).set(otherHeaders).send({
        name: 'ok',
        description: 'description',
        max_consultants: 2
      });

      assert.equal(res.statusCode, 401);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });
  });
  describe('get', () => {
    beforeEach(async () => {
      await AgencyConsultantRolesProjectionScenarios.removeAll();
    });
    it('should respond with 200 List Agency Consultant Roles', async () => {
      const schema = {
        type: 'array',
        items: {
          type: 'object',
          required: ['_id', 'name', 'description', 'max_consultants', 'updated_at', 'created_at', '__v'],
          properties: {
            _id: {
              type: 'string',
              pattern: '^[0-9a-fA-F]{24}$'
            },
            name: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            status: {
              type: 'string',
              enum: ['enabled', 'disabled']
            },
            max_consultants: {
              type: 'integer',
              minimum: 1
            },
            updated_at: {
              type: 'string',
              format: 'date-time'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            __v: {
              type: 'integer'
            }
          },
          additionalProperties: false
        }
      };

      await AgencyConsultantRolesProjectionScenarios.create({
        agency_id: agencyId
      });
      const res = await api.get(`/agency/${agencyId}/consultant-roles`).set(headers).send();

      assert.equal(res.statusCode, 200);
      assert.equal(res.headers['x-result-count'], '1');
      assert.isString(res.headers.link);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
      res.headers['content-type'].should.equal('application/json');
    });

    it('should respond with 204 List Agency Consultant Roles', async () => {
      const res = await api.get(`/agency/${agencyId}/consultant-roles`).set(headers).send();

      assert.equal(res.statusCode, 204);
      assert.isUndefined(res.headers['x-result-count']);
      assert.isUndefined(res.headers.link);
      assert.isEmpty(res.body);
      assert.isUndefined(res.headers['Content-Type']);
    });

    it('should response with 400 validation error', async () => {
      const schema = {
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: {
            type: 'string',
            enum: ['PATTERN', 'ENUM_MISMATCH', 'INVALID_TYPE', 'REQUIRED']
          },
          message: {
            type: 'string'
          }
        },
        additionalProperties: false
      };
      const res = await api.get('/agency/invalid/consultant-roles').set(headers).send();

      assert.equal(res.statusCode, 400);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });

    it('should response with 401 authorization failure', async () => {
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
      const res = await api.get(`/agency/${agencyId}/consultant-roles`).set(otherHeaders).send();

      assert.equal(res.statusCode, 401);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });
  });
});
