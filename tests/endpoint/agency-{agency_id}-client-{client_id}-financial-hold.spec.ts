import {TestUtilsZSchemaFormatter} from '../tools/TestUtilsZSchemaFormatter';
import ZSchema from 'z-schema';
import {assert} from 'chai';
import {api} from '../tools/TestUtilsApi';
import {getJWT} from '../tools/TestUtilsJwt';
import {cloneDeep} from 'lodash';
import {AgencyClientFinancialHoldsProjectionScenarios} from './scenarios/AgencyClientFinancialHoldsProjectionScenarios';
import {AgencyClientsProjectionScenarios} from './scenarios/AgencyClientsProjectionScenarios';

TestUtilsZSchemaFormatter.format();
const validator = new ZSchema({});

describe('agency-{agency_id}-client-{client_id}-financial-hold', () => {
  afterEach(async () => {
    await AgencyClientsProjectionScenarios.removeAll();
  });

  describe('get', () => {
    const agencyId = '62dfd97a38ca805fd2000001';
    const clientId = '62dfd98402f815105b000001';
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

    afterEach(async () => {
      await AgencyClientFinancialHoldsProjectionScenarios.removeAll();
    });
    it('should respond with 200 Retrieves a single Agency Client financial hold', async () => {
      const schema = {
        type: 'object',
        required: ['_id', 'agency_id', 'client_id', 'inherited', 'financial_hold', 'updated_at', 'created_at', '__v'],
        properties: {
          _id: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$'
          },
          agency_id: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$'
          },
          client_id: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$'
          },
          inherited: {
            type: 'boolean'
          },
          financial_hold: {
            type: 'string',
            enum: ['applied', 'cleared', 'not_set']
          },
          note: {
            type: 'string'
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
      };

      await AgencyClientFinancialHoldsProjectionScenarios.create({
        agency_id: agencyId,
        client_id: clientId
      });

      const res = await api.get(`/agency/${agencyId}/client/${clientId}/financial-hold`).set(headers).send();

      assert.equal(res.statusCode, 200);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });

    it('should respond with 401', async () => {
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
      const res = await api.get(`/agency/${agencyId}/client/${clientId}/financial-hold`).set(otherHeaders).send();

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

      const res = await api.get(`/agency/${agencyId}/consultant-roles/${clientId}`).set(headers).send();

      assert.equal(res.statusCode, 404);
      assert.isTrue(validator.validate(res.body, schema), 'response schema expected to be valid');
    });
  });
});
