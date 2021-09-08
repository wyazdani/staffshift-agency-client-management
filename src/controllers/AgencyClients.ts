import {ServerResponse} from "http";
import {GenericRepository} from "../GenericRepository";
import {get} from 'lodash';
import _ from "lodash";
import {AgencyClientsProjection} from "../models/AgencyClientsProjection";
const {QueryHelper} = require('a24-node-query-utils');
import {SwaggerRequest} from "SwaggerRequest";
import {PaginationHelper} from "../helpers/PaginationHelper";
const {ResourceNotFoundError} = require('a24-node-error-utils');

/**
 * Gets a single agency client
 *
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The callback used to pass control to the next middleware
 */
module.exports.getAgencyClient = async (req: SwaggerRequest, res: ServerResponse, next: Function): Promise<void> => {
  const swaggerParams = req.swagger.params || {};
  const logger = req.Logger;

  let limit = QueryHelper.getItemsPerPage(swaggerParams);
  let skip = QueryHelper.getSkipValue(swaggerParams, limit);
  let sortBy = QueryHelper.getSortParams(swaggerParams);
  let query = QueryHelper.getQuery(swaggerParams);

  query.agency_id = get(req, 'swagger.params.agency_id.value', '');
  query.client_id = get(req, 'swagger.params.client_id.value', '');

  const service = new GenericRepository(logger, AgencyClientsProjection);
  try {
    const {data} = await service.listResources(query, limit, skip, sortBy);
    if (_.isEmpty(data)) {
      logger.info('Resource retrieval completed, no record found.', {statusCode: 404});
      return next(new ResourceNotFoundError('Agency Client resource not found'));
    }

    logger.info('Resource retrieval completed', {statusCode: 200});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(data[0]));

  } catch (error) {
    return next(error);
  }
}

/**
 * Retrieves agency client listing
 *
 * @param req - The http request object
 * @param res - The http response object
 * @param next - The callback used to pass control to the next middleware
 */
module.exports.listAgencyClients = async (req: SwaggerRequest, res: ServerResponse, next: Function): Promise<void> => {
  const swaggerParams = req.swagger.params || {};
  const logger = req.Logger;

  let limit = QueryHelper.getItemsPerPage(swaggerParams);
  let skip = QueryHelper.getSkipValue(swaggerParams, limit);
  let sortBy = QueryHelper.getSortParams(swaggerParams);
  let query = QueryHelper.getQuery(swaggerParams);

  query.agency_id = get(req, 'swagger.params.agency_id.value', '');

  const service = new GenericRepository(logger, AgencyClientsProjection);
  try {
    const {count, data} = await service.listResources(query, limit, skip, sortBy);
    const statusCode = _.isEmpty(data) ? 204 : 200;
    await PaginationHelper.setPaginationHeaders(req, res, count);
    res.statusCode = statusCode;
    if (_.isEmpty(data)) {
      logger.info('Resource listing completed, no records found.', {statusCode});
      return res.end();
    }

    logger.info('Resource listing completed', {statusCode});
    return res.end(JSON.stringify(data));

  } catch (error) {
    return next(error);
  }
}
