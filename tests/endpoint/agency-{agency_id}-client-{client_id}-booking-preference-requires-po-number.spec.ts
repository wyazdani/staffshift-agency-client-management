import {TestUtilsZSchemaFormatter} from '../tools/TestUtilsZSchemaFormatter';
import ZSchema from 'z-schema';
import {assert} from 'chai';
import {api} from '../tools/TestUtilsApi';
import {getJWT} from '../tools/TestUtilsJwt';
import {cloneDeep} from 'lodash';
import {BookingPreferenceScenario} from './scenarios/BookingPreferenceScenario';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';
import sinon from 'sinon';

TestUtilsZSchemaFormatter.format();
const validator = new ZSchema({});
const bookingPreferenceScenario = new BookingPreferenceScenario(TestUtilsLogger.getLogger(sinon.spy()));

describe('agency-{agency_id}-client-{client_id}-booking-preference-requires-po-number', () => {
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

  beforeEach(async () => {
    await bookingPreferenceScenario.deleteAllEvents();
  });
  describe('post', () => {
    const agencyId = '6141d5be5863dc2202000001';
    const clientId = '6141d64365e0e52381000001';

    it('should respond with 202 updates requires-po-number', async () => {
      const res = await api
        .post(`/agency/${agencyId}/client/${clientId}/booking-preference/requires-po-number`)
        .set(headers)
        .send({});

      res.statusCode.should.equal(202);
      assert.match(res.get('ETag'), /W\/"booking_preference:\d*"/, 'FAILED');
    });

    it('should respond with 400 Validation Error', async () => {
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
                  enum: ['OBJECT_ADDITIONAL_PROPERTIES', 'ALREADY_SET']
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
      const res = await api
        .post(`/agency/${agencyId}/client/${clientId}/booking-preference/requires-po-number`)
        .set(headers)
        .send({
          test: 'test'
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
      const otherHeaders = cloneDeep(headers);

      otherHeaders['x-request-jwt'] = 'invalid';
      const res = await api
        .post(`/agency/${agencyId}/client/${clientId}/booking-preference/requires-po-number`)
        .set(otherHeaders)
        .send({});

      assert.equal(res.statusCode, 401);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });

    it('should respond with 412 Precondition Failed', async () => {
      const schema = {
        description: 'Request precondition failed',
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: {
            type: 'string',
            enum: ['PRECONDITION_FAILED']
          },
          message: {
            type: 'string'
          }
        },
        additionalProperties: false
      };

      await bookingPreferenceScenario.setRequiresBookingPassword(agencyId, clientId);
      const ifMatchHeaders = {...headers, 'If-Match': 'W/"booking_preference:101"'};
      const res = await api
        .post(`/agency/${agencyId}/client/${clientId}/booking-preference/requires-po-number`)
        .set(ifMatchHeaders)
        .send({});

      res.statusCode.should.be.equal(412);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });
  });

  describe('delete', () => {
    const agencyId = '6141d5be5863dc2202000001';
    const clientId = '6141d64365e0e52381000001';

    it('should respond with 202 updates requires-po-number', async () => {
      await bookingPreferenceScenario.setRequiresPONumber(agencyId, clientId);
      const res = await api
        .delete(`/agency/${agencyId}/client/${clientId}/booking-preference/requires-po-number`)
        .set(headers)
        .send({});

      res.statusCode.should.equal(202);
      assert.match(res.get('ETag'), /W\/"booking_preference:\d*"/, 'FAILED');
    });

    it('should respond with 400 Validation Error', async () => {
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
                  enum: ['OBJECT_ADDITIONAL_PROPERTIES', 'ALREADY_NOT_SET']
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
      const res = await api
        .delete(`/agency/${agencyId}/client/${clientId}/booking-preference/requires-po-number`)
        .set(headers)
        .send({
          test: 'test'
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
      const otherHeaders = cloneDeep(headers);

      otherHeaders['x-request-jwt'] = 'invalid';
      const res = await api
        .delete(`/agency/${agencyId}/client/${clientId}/booking-preference/requires-po-number`)
        .set(otherHeaders)
        .send({});

      assert.equal(res.statusCode, 401);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });

    it('should respond with 412 Precondition Failed', async () => {
      const schema = {
        description: 'Request precondition failed',
        type: 'object',
        required: ['code', 'message'],
        properties: {
          code: {
            type: 'string',
            enum: ['PRECONDITION_FAILED']
          },
          message: {
            type: 'string'
          }
        },
        additionalProperties: false
      };

      await bookingPreferenceScenario.setRequiresBookingPassword(agencyId, clientId);
      const ifMatchHeaders = {...headers, 'If-Match': 'W/"booking_preference:101"'};
      const res = await api
        .delete(`/agency/${agencyId}/client/${clientId}/booking-preference/requires-po-number`)
        .set(ifMatchHeaders)
        .send({});

      res.statusCode.should.be.equal(412);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });
  });
});
