import {get} from 'lodash';
import {ServerResponse} from 'http';
import {SwaggerRequestInterface} from 'SwaggerRequestInterface';
import {QueryHelper, LinkHeaderHelper} from 'a24-node-query-utils';

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
  static setPaginationHeaders(req: SwaggerRequestInterface, res: ServerResponse, count: number): void {
    const swaggerParams = get(req, 'swagger.params', {});

    const relLinkOptions = {
      count,
      url: req.basePathName,
      page: get(swaggerParams, 'page.value'),
      items_per_page: get(swaggerParams, 'items_per_page.value'),
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
