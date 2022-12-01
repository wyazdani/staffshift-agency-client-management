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
  add_client_contact_person: {
    type: 'object',
    properties: {
      title: {
        type: 'string'
      },
      first_name: {
        type: 'string'
      },
      last_name: {
        type: 'string'
      },
      designation_type_id: {
        type: 'string'
      },
      email: {
        type: 'string'
      },
      contact_numbers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type_id: {
              type: 'string'
            },
            contact_number: {
              type: 'string'
            }
          },
          required: ['type_id', 'contact_number'],
          additionalProperties: false
        }
      },
      type_ids: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    },
    required: ['last_name'],
    additionalProperties: false
  },
  change_client_shift_time_pattern: {
    // This is a special case where the start_time and end_time are Entities
    type: 'object',
    properties: {
      name: {
        type: 'string'
      },
      start_time: {
        type: 'object',
        properties: {
          hour: {
            type: 'number'
          },
          minute: {
            type: 'number'
          }
        },
        required: ['hour', 'minute'],
        additionalProperties: false
      },
      end_time: {
        type: 'object',
        properties: {
          hour: {
            type: 'number'
          },
          minute: {
            type: 'number'
          }
        },
        required: ['hour', 'minute'],
        additionalProperties: false
      }
    },
    required: ['name', 'start_time', 'end_time'],
    additionalProperties: false
  },
  synchronise_organisation_initialisation: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1
      },
      industry_id: {
        type: 'string',
        pattern: '^[0-9a-fA-F]{24}$'
      },
      country_code: {
        type: 'string',
        minLength: 1
      },
      locale_id: {
        type: 'string',
        minLength: 1
      },
      timezone: {
        type: 'string',
        minLength: 1
      }
    },
    required: ['name', 'industry_id', 'country_code'],
    additionalProperties: false
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
