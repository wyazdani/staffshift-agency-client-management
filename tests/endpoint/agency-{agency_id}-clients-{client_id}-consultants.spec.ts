import {cloneDeep} from 'lodash';
import Zschema from 'z-schema';
import {TestUtilsZSchemaFormatter} from '../tools/TestUtilsZSchemaFormatter';
import {assert} from 'chai';
import {api} from '../tools/TestUtilsApi';
import {getJWT} from '../tools/TestUtilsJwt';
import {AgencyClientScenario} from './scenarios/AgencyClientScenario';
import {AgencyConsultantRoleScenario} from './scenarios/AgencyConsultantRoleScenario';
import {AgencyClientConsultantsProjectionScenarios} from './scenarios/AgencyClientConsultantsProjectionScenarios';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';
import sinon from 'sinon';

TestUtilsZSchemaFormatter.format();
const validator = new Zschema({});

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
  const agencyClientScenario = new AgencyClientScenario(TestUtilsLogger.getLogger(sinon.spy()));
  const agencyConsultantRoleScenario = new AgencyConsultantRoleScenario(TestUtilsLogger.getLogger(sinon.spy()));

  beforeEach(async () => {
    await Promise.all([
      agencyClientScenario.linkAgencyClient(agencyId, clientId),
      agencyConsultantRoleScenario.addAgencyConsultantRole(agencyId, roleId)
    ]);
  });

  afterEach(async () => {
    await agencyClientScenario.deleteAllEvents();
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
            enum: ['REQUIRED', 'SCHEMA_VALIDATION_FAILED', 'MODEL_VALIDATION_FAILED', 'PATTERN']
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
                    'CONSULTANT_ROLE_NOT_ENABLED',
                    'CONSULTANT_ROLE_NOT_FOUND',
                    'MAX_CONSULTANTS_ASSIGNED'
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
        },
        additionalProperties: false
      };
      const headersClone = cloneDeep(headers);

      headersClone['x-request-jwt'] = 'invalid';
      const res = await api.post(`/agency/${agencyId}/clients/${clientId}/consultants`).set(headersClone).send({
        consultant_role_id: '6151ada2ff873ad464bdd33c',
        consultant_id: '61432f88d7667e06d38e73b4'
      });

      assert.equal(res.statusCode, 401);
      assert.isTrue(validator.validate(res.body, schema), 'response does not match expected schema');
    });

    it('should respond with 404 validation Error', async () => {
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
      const res = await api.post(`/agency/${agencyId}/clients/5f5b8afe085def4826c43ee8/consultants`).set(headers).send({
        consultant_role_id: roleId,
        consultant_id: '61432f88d7667e06d38e73b4'
      });

      assert.equal(res.statusCode, 404, 'incorrect status code returned');
      assert.isTrue(validator.validate(res.body, schema), 'response does not match expected schema');
    });
  });

  describe('get', () => {
    const sortByCriteria = ['_id', '-_id'];

    it('should respond with 200 List Agency Client...', async () => {
      /*eslint-disable*/
      const schema = {
        "type": "array",
        "items": {
          "type": "object",
          "required": [
            "_id",
            "agency_id",
            "client_id",
            "consultant_role_id",
            "consultant_role_name",
            "consultant_id",
            "consultant_name",
            "created_at",
            "updated_at",
            "__v"
          ],
          "properties": {
            "_id": {
              "type": "string"
            },
            "agency_id": {
              "type": "string"
            },
            "client_id": {
              "type": "string"
            },
            "consultant_role_id": {
              "type": "string"
            },
            "consultant_role_name": {
              "type": "string"
            },
            "consultant_id": {
              "type": "string"
            },
            "consultant_name": {
              "type": "string"
            },
            "created_at": {
              "type": "string"
            },
            "updated_at": {
              "type": "string"
            },
            "__v": {
              "type": "number"
            }
          },
          "additionalProperties": false
        }
      };
      /*eslint-enable*/

      await AgencyClientConsultantsProjectionScenarios.createRecord({
        agency_id: agencyId,
        client_id: clientId
      });
      const res = await api.get(`/agency/${agencyId}/clients/${clientId}/consultants`).set(headers);

      res.statusCode.should.equal(200);
      validator.validate(res.body, schema);
      assert.equal(res.body[0].agency_id, agencyId);
      assert.equal(res.body[0].client_id, clientId);
    });

    for (const criteria of sortByCriteria) {
      it(`should respond with 200 List Agency Client with sort criteria: ${criteria}`, async () => {
        /*eslint-disable*/
        const schema = {
          "type": "array",
          "items": {
            "type": "object",
            "required": [
              "_id",
              "agency_id",
              "client_id",
              "consultant_role_id",
              "consultant_role_name",
              "consultant_id",
              "consultant_name",
              "created_at",
              "updated_at",
              "__v"
            ],
            "properties": {
              "_id": {
                "type": "string"
              },
              "agency_id": {
                "type": "string"
              },
              "client_id": {
                "type": "string"
              },
              "consultant_role_id": {
                "type": "string"
              },
              "consultant_role_name": {
                "type": "string"
              },
              "consultant_id": {
                "type": "string"
              },
              "consultant_name": {
                "type": "string"
              },
              "created_at": {
                "type": "string"
              },
              "updated_at": {
                "type": "string"
              },
              "__v": {
                "type": "number"
              }
            },
            "additionalProperties": false
          }
        };
        /*eslint-enable*/

        await AgencyClientConsultantsProjectionScenarios.createRecord({
          agency_id: agencyId,
          client_id: clientId
        });
        const res = await api.get(`/agency/${agencyId}/clients/${clientId}/consultants?sortBy=${criteria}`).set(headers);

        res.statusCode.should.equal(200);
        validator.validate(res.body, schema);
        assert.equal(res.body[0].agency_id, agencyId);
        assert.equal(res.body[0].client_id, clientId);
      });
    }

    it('should respond with 204 No Content. There were no...', async () => {
      await AgencyClientConsultantsProjectionScenarios.removeAll();
      const res = await api.get(`/agency/${agencyId}/clients/${clientId}/consultants`).set(headers);

      res.statusCode.should.equal(204);
    });

    it('should respond with 400 Validation Error. Usually...', async () => {
      /*eslint-disable*/
      const schema = {
        "type": "object",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "string",
            "enum": [
              "PATTERN",
              "INVALID_TYPE",
              "REQUIRED"
            ]
          },
          "message": {
            "type": "string"
          }
        },
        "additionalProperties": false
      };
      /*eslint-enable*/
      const res = await api.get(`/agency/${agencyId}/clients/123/consultants`).set(headers);

      res.statusCode.should.equal(400);
      validator.validate(res.body, schema);
    });

    it('should respond with 401 Failed to authenticate the...', async () => {
      /*eslint-disable*/
      const schema = {
        "type": "object",
        "required": [
          "code",
          "message"
        ],
        "properties": {
          "code": {
            "type": "string",
            "enum": [
              "UNAUTHORIZED"
            ]
          },
          "message": {
            "type": "string"
          }
        },
        "additionalProperties": false
      };

      /*eslint-enable*/
      const res = await api.get(`/agency/${agencyId}/clients/${clientId}/consultants`).set({
        'x-request-jwt': jwtToken + '123',
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Request-Id': '123'
      });

      res.statusCode.should.equal(401);
      validator.validate(res.body, schema);
    });
  });
});
