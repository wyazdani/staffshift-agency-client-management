'use strict';

/**
 * Custom and Mongo change stream event enums
 *
 * @see https://docs.mongodb.com/manual/reference/change-events/
 */
module.exports = {
  SEED: 'seed',
  SYNC: 'sync',
  INSERT: 'insert',
  UPDATE: 'update',
  REPLACE: 'replace',
  DELETE: 'delete'
};
