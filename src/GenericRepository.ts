import {LoggerContext} from "a24-logzio-winston";
import {FilterQuery, Model} from "mongoose";
const {RuntimeError} = require('a24-node-error-utils');

/**
 * GenericRepository
 *  Based on the new implementation details the service layer no longer exists.
 *  Should this be injected into the well defined aggregates rather?
 *  IE a mixin concept / parasitic inheritance / Based on interfaces?
 */
export class GenericRepository {
  private logger: LoggerContext;
  private store: Model<any>;
  constructor(logger: LoggerContext, store: Model<any>) {
    this.logger = logger;
    this.store = store;
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
  async listResources(query: FilterQuery<any>, limit: number, skip: number, sortBy: Object): Promise<{count: number, data: any[]}> {
    try {
      const [count, data] = await Promise.all([
        this.getCount(query),
        this.getListing(query, skip, limit, sortBy)
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


  /**
   * Gets the count of records that matches a given query
   *
   * @param {FilterQuery} query - The query to match
   *
   * @private
   *
   * @return Promise<Number>
   */
  private async getCount(query: FilterQuery<any>): Promise<number> {
    try {
      return await this.store.countDocuments(query);
    } catch (dbError) {
      throw new RuntimeError(
        `An error occurred while counting records for ${this.store.modelName}`,
        dbError
      );
    }
  }

  /**
   * Get the list of records that matches the given query
   *
   * @param {FilterQuery} query - The query to match
   * @param {Number} skip - The skip value
   * @param {Number} limit - The item per page value
   * @param {Object} sortBy - The sortBy parameters
   *
   * @private
   *
   * @return Promise<Array<Object>>
   */
  private async getListing(query: FilterQuery<any>, skip:number, limit:number, sortBy: Object) {
    try {
      return await this.store.find(query)
        .skip(skip)
        .limit(limit)
        .sort(sortBy)
        .lean()
        .exec();
    } catch (dbError) {
      throw new RuntimeError(`An error occurred while listing the records for ${this.store.modelName}`, {dbError});
    }
  }
}