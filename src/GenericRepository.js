'use strict';
const {RuntimeError} = require('a24-node-error-utils');

/**
 * GenericRepository
 *  Based on the new implementation details the service layer no longer exists.
 *  Should this be injected into the well defined aggregates rather?
 *  IE a mixin concept / parasitic inheritance / Based on interfaces?
 */
class GenericRepository {
  constructor(logger, collection) {
    this.logger = logger;
    this._store = collection;
  }

  /**
   * Retrieves a list of all records for the given params
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
  GenericRepository
};