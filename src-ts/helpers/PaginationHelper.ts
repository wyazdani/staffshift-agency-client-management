import _ from "lodash";
import {ServerResponse} from "http";
const {QueryHelper, LinkHeaderHelper} = require('a24-node-query-utils');

/**
 * Class responsible for managing pagination related functionality
 */
export class PaginationHelper {
  /**
   * Set the pagination headers to the response
   *
   * @param {ClientRequest} req - The http request object
   * @param {IncomingMessage} res - The http response object
   * @param {Number} count - The total number of records
   */
  static setPaginationHeaders(req: any, res: ServerResponse, count: number) {
    const swaggerParams = _.get(req, 'swagger.params', {});
    const relLinkOptions = {
      count,
      url: req.basePathName,
      page: _.get(swaggerParams, 'page.value'),
      items_per_page: _.get(swaggerParams, 'items_per_page.value'),
      query_string: QueryHelper.getQueryAndSortingString(swaggerParams)
    };
    // If there are no items there is no content
    if (count > 0) {
      res.setHeader('Content-Type', 'application/json');
    }
    res.setHeader('x-result-count', count);
    res.setHeader('link', LinkHeaderHelper.getRelLink(relLinkOptions));
  }
}