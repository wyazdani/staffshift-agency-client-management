import {ClientRequest, ServerResponse} from 'http';
import {GenericRepository} from '../GenericRepository';
import {AgencyClientEventLog} from '../models/AgencyClientEventLog';
import {PaginationHelper} from '../helpers/PaginationHelper';
import {SwaggerRequest} from 'SwaggerRequest';
import _ from 'lodash';
const {QueryHelper} = require('a24-node-query-utils');

/**
 * Retrieves agency client event listing
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The callback used to pass control to the next middleware
 */
module.exports.listAgencyClientEventLogs = async (req: SwaggerRequest, res: ServerResponse, next: Function): Promise<void> => {
  const swaggerParams = req.swagger.params || {};
  const logger = req.Logger;

  const limit = QueryHelper.getItemsPerPage(swaggerParams);
  const skip = QueryHelper.getSkipValue(swaggerParams, limit);
  const sortBy = QueryHelper.getSortParams(swaggerParams);
  const query = QueryHelper.getQuery(swaggerParams);

  query.agency_id = _.get(req, 'swagger.params.agency_id.value', '');
  query.client_id = _.get(req, 'swagger.params.client_id.value', '');

  const service = new GenericRepository(logger, AgencyClientEventLog);
  try {
    const {count, data} = await service.listResources(query, limit, skip, sortBy);
    const statusCode = _.isEmpty(data) ? 204 : 200;
    await PaginationHelper.setPaginationHeaders(req, res, count);
    res.statusCode = statusCode;
    if (_.isEmpty(data)) {
      logger.info('The GET list call of Tags has been completed successfully, but no records were found.', {
        statusCode
      });
      return res.end();
    }

    logger.info(
      'The GET list call of Tags has been completed successfully with result',
      {
        statusCode
      }
    );
    return res.end(JSON.stringify(data));

  } catch (error) {
    return next(error);
  }
};
