'use strict';
const _ = require('lodash');
const {AgencyClients} = require('../models');
const {
  RuntimeError, ConflictError, ValidationError, ResourceNotFoundError, PermissionDenied
} = require('a24-node-error-utils');


/**
 * AgencyClientsService
 */
class AgencyClientsService {
  constructor(logger) {
    this.logger = logger;
    this._store = AgencyClients
  }
  /**
   * Retrieves a list of all tag records
   *
   * @param {Object} query - The query object to retrieve list of tags
   * @param {Number} limit - The item per page value
   * @param {Number} skip - The skip value
   * @param {Object} sortBy - The sortBy parameters
   *
   * @return Promise<Object>
   */
  async listResources(query, limit, skip, sortBy) {
    try {
      const [count, data] = await Promise.all([
        _getCount(this._store, query),
        _getListing(this._store, query, skip, limit, sortBy)
      ]);
      return {
        count,
        data
      };
    } catch (error) {
      this.logger.error('The GET list call for tags failed', error);
      throw error;
    }
  }
}

/**
 * Gets the count of records that matches a given query
 *
 * @param {Object} query - The query to match
 *
 * @private
 *
 * @return Promise<Number>
 */
async function _getCount(store, query) {
  try {
    return await store.countDocuments(query);
  } catch (dbError) {
    throw new RuntimeError(
      `An error occurred while counting records for ${store.modelName}`,
      dbError
    );
  }
}

/**
 * Get the list of records that matches the given query
 *
 * @param {Object} query - The query to match
 * @param {Number} skip - The skip value
 * @param {Number} limit - The item per page value
 * @param {Object} sortBy - The sortBy parameters
 *
 * @private
 *
 * @return Promise<Array<Object>>
 */
 async function _getListing(store, query, skip, limit, sortBy) {
  try {
    const list = await store.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortBy)
      .lean()
      .exec();
    return list;
  } catch (dbError) {
    throw new RuntimeError(`An error occurred while listing the records for ${store.modelName}`, {dbError});
  }
}


module.exports = {
  AgencyClientsService
};