import {LoggerContext} from 'a24-logzio-winston';
import {FilterQuery, Model} from 'mongoose';
import {RuntimeError} from 'a24-node-error-utils';
import {GenericObjectInterface} from 'GenericObjectInterface';
import {forIn, forEach} from 'lodash';

/**
 * GenericRepository
 *  Based on the new implementation details the service layer no longer exists.
 *  Should this be injected into the well defined aggregates rather?
 *  IE a mixin concept / parasitic inheritance / Based on interfaces?
 */
export class GenericRepository {
  constructor(private logger: LoggerContext, private store: Model<any>) {}

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
  async listResources(
    query: FilterQuery<any>,
    limit: number,
    skip: number,
    sortBy: GenericObjectInterface
  ): Promise<{count: number; data: any[]}> {
    try {
      const [count, data] = await Promise.all([this.getCount(query), this.getListing(query, skip, limit, sortBy)]);

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
   * find only one record
   *
   * @param query - query to filter
   */
  async findOne(query: FilterQuery<any>): Promise<any> {
    return this.store.findOne(query, this.getProjection());
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
      throw new RuntimeError(`An error occurred while counting records for ${this.store.modelName}`, dbError);
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
  private async getListing(query: FilterQuery<any>, skip: number, limit: number, sortBy: GenericObjectInterface) {
    try {
      return await this.store.find(query, this.getProjection()).skip(skip).limit(limit).sort(sortBy).lean().exec();
    } catch (dbError) {
      throw new RuntimeError(`An error occurred while listing the records for ${this.store.modelName}`, {dbError});
    }
  }

  /**
   * get projection object, we exclude fields that we enabled `http_hidden`
   *
   * @private
   */
  private getProjection(): {[key: string]: number} {
    const result: {[key: string]: number} = {};

    forEach<string[]>(this.getHiddenFields(), (value: string) => {
      result[value] = 0;
    });
    return result;
  }

  /**
   * get list of hidden fields from the model schema
   *
   * @private
   */
  private getHiddenFields(): string[] {
    const excludes: string[] = [];

    forIn(this.store.schema.obj, (config, field) => {
      if (config.http_hidden) {
        excludes.push(field);
      }
    });
    return excludes;
  }
}
