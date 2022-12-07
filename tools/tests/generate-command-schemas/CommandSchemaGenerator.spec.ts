/**
 * This Test is not a unit test, it makes sure that the generator is successfully executed and asserts some schemas
 */
import {rm} from 'fs/promises';
import {after} from 'mocha';
import path from 'path';
import {CommandSchemaGenerator} from '../../generate-command-schemas/CommandSchemaGenerator';

/**
 * These assertions are randomly picked, if you want to assert a specific case you can add it to the array
 */
const assertions: {[key in string]: unknown} = {
  add_agency_client_consultant: {
    $ref: '#/definitions/AddAgencyClientConsultantCommandDataInterface',
    definitions: {
      AddAgencyClientConsultantCommandDataInterface: {
        type: 'object',
        properties: {
          _id: {
            type: 'string'
          },
          consultant_role_id: {
            type: 'string'
          },
          consultant_id: {
            type: 'string'
          }
        },
        required: ['_id', 'consultant_role_id', 'consultant_id'],
        additionalProperties: false
      }
    }
  },
  fail_item_client_inheritance_process: {
    $ref: '#/definitions/FailItemClientInheritanceProcessCommandDataInterface',
    definitions: {
      FailItemClientInheritanceProcessCommandDataInterface: {
        type: 'object',
        properties: {
          client_id: {
            type: 'string'
          },
          errors: {
            type: 'array',
            items: {
              $ref: '#/definitions/EventStoreEncodedErrorInterface'
            }
          }
        },
        required: ['client_id', 'errors'],
        additionalProperties: false
      },
      EventStoreEncodedErrorInterface: {
        type: 'object',
        properties: {
          code: {
            type: 'string'
          },
          message: {
            type: 'string'
          },
          status: {
            type: 'number'
          },
          original_error: {
            $ref: '#/definitions/EventStoreEncodedErrorInterface'
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                code: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                path: {
                  type: 'array',
                  items: {
                    type: 'string'
                  }
                }
              },
              required: ['code', 'message'],
              additionalProperties: false
            },
            minItems: 1,
            maxItems: 1
          }
        },
        required: ['code', 'message'],
        additionalProperties: false
      }
    }
  }
};

const OUTPUT_PATH = path.resolve(__dirname, 'generated-schemas');

describe('CommandSchemaGenerator', () => {
  describe('execute()', () => {
    before(async function () {
      this.timeout(8 * 60 * 1000); // 8 minutes

      await CommandSchemaGenerator.execute(OUTPUT_PATH);
    });
    after(async () => {
      await rm(OUTPUT_PATH, {recursive: true});
    });
    for (const command in assertions) {
      it(`Test command schema generator: ${command}`, async () => {
        const commandSchemas = await import(OUTPUT_PATH);

        commandSchemas.default[command].should.deep.equal(assertions[command]);
      });
    }
  });
});
