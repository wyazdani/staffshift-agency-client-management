import {TestUtilsZSchemaFormatter} from '../tools/TestUtilsZSchemaFormatter';
import ZSchema from 'z-schema';
import {assert} from 'chai';
import {api} from '../tools/TestUtilsApi';
import {getJWT} from '../tools/TestUtilsJwt';
import {cloneDeep} from 'lodash';
import {BookingPreferenceScenario} from './scenarios/BookingPreferenceScenario';

TestUtilsZSchemaFormatter.format();
const validator = new ZSchema({});
const bookingPreferenceScenario = new BookingPreferenceScenario();

describe('agency-{agency_id}-client-{client_id}-booking-preference-requires-booking-password', () => {
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
  const agencyId = '6141d5be5863dc2202000001';
  const clientId = '6141d64365e0e52381000001';

  beforeEach(async () => {
    await bookingPreferenceScenario.deleteAllEvents();
  });
  describe('post', () => {
    const payload = {
      booking_passwords: ['1', '12']
    };

    it('should respond with 202 updates requires-booking-password', async () => {
      const res = await api
        .post(`/agency/${agencyId}/client/${clientId}/booking-preference/requires-booking-password`)
        .set(headers)
        .send(payload);

      res.statusCode.should.equal(202);
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
        .post(`/agency/${agencyId}/client/${clientId}/booking-preference/requires-booking-password`)
        .set(otherHeaders)
        .send(payload);

      assert.equal(res.statusCode, 401);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });
  });

  describe('put', () => {
    const payload = {
      booking_passwords: ['1', '12']
    };

    it('should respond with 202 updates requires-booking-password', async () => {
      await bookingPreferenceScenario.setRequiresBookingPassword(agencyId, clientId);
      const res = await api
        .put(`/agency/${agencyId}/client/${clientId}/booking-preference/requires-booking-password`)
        .set(headers)
        .send(payload);

      res.statusCode.should.equal(202);
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
        .put(`/agency/${agencyId}/client/${clientId}/booking-preference/requires-booking-password`)
        .set(otherHeaders)
        .send(payload);

      assert.equal(res.statusCode, 401);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });
  });

  describe('delete', () => {
    it('should respond with 202 updates requires-booking-password', async () => {
      await bookingPreferenceScenario.setRequiresBookingPassword(agencyId, clientId);
      const res = await api
        .delete(`/agency/${agencyId}/client/${clientId}/booking-preference/requires-booking-password`)
        .set(headers)
        .send({});

      res.statusCode.should.equal(202);
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
        .delete(`/agency/${agencyId}/client/${clientId}/booking-preference/requires-booking-password`)
        .set(otherHeaders)
        .send({});

      assert.equal(res.statusCode, 401);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });
  });
});
