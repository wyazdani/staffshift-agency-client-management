'use strict';
const {GenericRepository} = require('../src/GenericRepository');
const {AgencyClientEventLog} = require('../models');
const {QueryHelper} = require('a24-node-query-utils');
const {PaginationHelper} = require('../helpers/PaginationHelper');
const _ = require('lodash');

/**
 * Retrieves agency client event listing
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {Function} next - The callback used to pass control to the next middleware
 *
 */
module.exports.listAgencyClientEventLogs = async (req, res, next) => {
  const swaggerParams = req.swagger.params || {};
  const logger = req.Logger;

  let limit = QueryHelper.getItemsPerPage(swaggerParams);
  let skip = QueryHelper.getSkipValue(swaggerParams, limit);
  let sortBy = QueryHelper.getSortParams(swaggerParams);
  let query = QueryHelper.getQuery(swaggerParams);

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